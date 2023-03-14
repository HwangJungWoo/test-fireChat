import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  /**
   * ChatService에서 getChatRooms() 메서드를 정의합니다. 이 메서드는 현재 사용자가 참여한 모든 채팅방을 가져오는 Firestore 쿼리를 실행합니다.
   * ChatListComponent에서 ngOnInit() 라이프 사이클 후크를 사용하여 ChatService에서 getChatRooms() 메서드를 호출합니다.
   * ChatListComponent에서 chatRooms 변수를 정의하고, ChatService에서 가져온 채팅방 목록을 할당합니다.
   * ChatListComponent에서 orderBy() 함수를 사용하여 채팅방 목록을 최근 대화한 순서로 정렬합니다.
   * ChatListComponent에서 async 파이프(async pipe)를 사용하여 채팅방 목록을 템플릿에 바인딩합니다. 
   * 이 때, async 파이프는 ChatService에서 가져온 Firestore 쿼리를 구독하고, 자동으로 데이터를 업데이트합니다.
   * 위 메커니즘을 요약하면, ChatService에서 Firestore 쿼리를 실행하여 현재 사용자가 참여한 모든 채팅방을 가져오고, 
   * ChatListComponent에서 채팅방 목록을 가져와 최근 대화한 순서로 정렬한 후, 
   * async 파이프를 사용하여 채팅방 목록을 자동으로 업데이트하는 것입니다. 이를 통해, 최근 대화한 채팅방 목록을 보다 간편하게 구현할 수 있습니다.
   */
  @ViewChild('new_chat') modal: ModalController | undefined;
  @ViewChild('popover') popover: PopoverController | undefined;
  
  segment = 'chats';
  
  open_new_chat = false;

  users: Observable<any[]> | undefined;
  chatRooms: Observable<any[]> | undefined;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'dark'
  };
  // users = [
  //   { id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315' },
  //   { id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325' },
  // ];
  
  // chatRooms = [
  //   { id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315' },
  //   { id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325' },
  // ];

  constructor(
    private router: Router,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
  }

  async logout() {
    try {
      if (this.popover != undefined) {
        this.popover.dismiss();
        await this.chatService.auth.logout();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    } catch (err) {
      console.log(err);
    }    
  }

  onSegmentChanged(event: any) {
    console.log(event);
  }

  newChat() {
    this.open_new_chat = true;
    if (!this.users) { 
      this.getUsers();
    }
  }

  getUsers() {
    this.chatService.getUsers();
    this.users = this.chatService.users;
  }

  onWillDismiss(event: any) { }

  cancel() {
    if (this.modal != undefined) {
      this.modal.dismiss();
      this.open_new_chat = false;
    }
  }

  // ?. 연산자는 옵셔널 체이닝(optional chaining) 연산자입니다. 
  // 이 연산자는 프로퍼티나 메소드에 접근하기 전에 해당 값이 undefined 또는 null인지 확인하고, 
  // 값이 없으면 undefined를 반환합니다. 이를 통해, 코드에서 발생할 수 있는 TypeError를 방지할 수 있습니다.
  // 따라서, item?.name은 item 객체의 name 프로퍼티에 접근하기 전에 item이 undefined 또는 null인지 확인합니다. 
  // item이 undefined 또는 null이면, undefined를 반환하고, 그렇지 않으면 item.name에 접근합니다.
  // item : 선택한 유저 정보
  async startChat(item: any) {
    try {
      const room =  await this.chatService.createChatRoom(item?.uid);
      this.cancel();
      // const name = this.getUser(item?.user)?.name;
      
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.name,
          id: room?.id,
        }
      };
      this.router.navigate(['/', 'main', 'chats', room?.id], navData);
    } catch(error) {
      console.log(error);
    }
  }

  getChat(item: any) {
    (item?.user).pipe(
      take(1)
    ).subscribe((user_data: any) => {
      const navData: NavigationExtras = {
        queryParams: {
          name: user_data?.name,
          id: item?.id,
        }      
      };

      console.log('main.page.ts getChat() item?.id is :', item?.id);
      this.router.navigate(['/', 'main', 'chats', item?.id], navData);
    });    
  }

  getUser(user: any) {
    return user;
  }

}
