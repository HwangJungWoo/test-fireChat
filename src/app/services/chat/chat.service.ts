import { Injectable } from '@angular/core';
import { map, Observable, of, pipe, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUserId: string = '';
  public users: Observable<any> | undefined;
  public chatRooms: Observable<any> | undefined;
  public selectedChatRoomMessages: Observable<any> | undefined;

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) {
    this.getId();
  }

  getId() {
    this.currentUserId = this.auth.getId();
  }

  // firestore에서 'users' 컬렉션에서 'uid' 필드 값이 현재 사용자의 uid와 다른 사용자를 가져오는 메소드
  getUsers() {
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '!=', this.currentUserId)
    );
  }

  async createChatRoom(user_id: string) {
    try {
      let room: any;

      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        // in 조건은 주어진 필드의 값이 지정된 배열 중 하나와 일치하는 모든 문서를 선택하는 
        // Firestore 쿼리 조건 중 하나입니다. 
        // 예를 들어, where('state', 'in', ['CA', 'NY', 'TX']) 는 state 필드가 CA, NY, 또는 TX 중 하나와 일치하는 모든 문서를 선택합니다.
        this.api.whereQuery(
          'members',
          'in',
          [[user_id, this.currentUserId], [this.currentUserId, user_id]],
        )
      );

      room = await querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });

      console.log('exist docs: ', room);
      if (room?.length > 0) return room[0];

      const data = {
        members: [
          this.currentUserId,
          user_id
        ],
        type: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      room = await this.api.addDocuments('chatRooms', data);
      return room;
    } catch (err) {
      throw (err);
    }
  }

  getChatRooms() {
    // 채팅방 데이터를 가져오는 API 호출
    this.chatRooms = this.api.collectionDataQuery(
      'chatRooms',
      this.api.whereQuery('members', 'array-contains', this.currentUserId)
    ).pipe( // 데이터 변환
      map(
        (data: any[]) => {
          console.log('room data: ', data);
          data.map(
             // 현재 사용자가 아닌 다른 사용자의 ID를 가져오기 위해 filter() 사용
            (element: any) => {
              // 다른 사용자의 ID를 기반으로 Firestore에서 사용자 정보를 가져옴
              // 현재 사용자의 ID를 제외한 다른 사용자의 ID만을 반환
              const user_data = element.members.filter((x: any) => x != this.currentUserId);
              console.log('user data: ', user_data);
              const user = this.api.docDataQuery(`users/${user_data[0]}`, true); // true 옵션을 사용하여 데이터를 실시간으로 가져오도록 설정

              console.log('element.user: ', user);
              element.user = user; // 가져온 사용자 정보를 원본 데이터에 추가

              
            }
          );        
          return (data);
        }
      ),
      // 데이터 흐름 제어 연산자
      switchMap(data => {
        return of(data); // 데이터를 새로운 Observable로 래핑
      })
    );    
  }

  getChatRoomMessages(chatRoomId: string) {
    this.selectedChatRoomMessages = this.api.collectionDataQuery(
      `chats/${chatRoomId}/messages`,
      this.api.orderByQuery('createdAt', 'desc')
    )
    .pipe(map((arr: any) => arr.reverse()));
  }

  async sendMessage(chatId: string, msg: string) {
    try {
      const new_messages = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date()      
      };
      if(chatId) {
        await this.api.addDocuments(`chats/${chatId}/messages`, new_messages);
      }
    } catch(e) {
      throw(e)
    }
  }
}
