import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  id: string = '';
  name: string = '';
  chats: Observable<any[]> | undefined;
  message: string = '';
  isLoading: boolean = false;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Conversation',
    color: 'warning'
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService,
  ) { }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    if(data?.name) {
      this.name = data.name;
    }
    const id = this.route.snapshot.queryParamMap.get('id');
    if(!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    this.chatService.getChatRoomMessages(this.id);
    this.chats = this.chatService.selectedChatRoomMessages;
  }

  ngAterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.chats) this.content?.scrollToBottom(500);
  }

  async sendMessage() {
    if(!this.message || this.message?.trim() == '') {
      // this.global.errorToast('Please enter a proper message', 2000);
      return;    
    }
    try {
      this.isLoading = true;
      await this.chatService.sendMessage(this.id, this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch (e) {
      this.isLoading = false;
      // this.global.errorToast();
      console.log(e);
    }
  }

}
