import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';
// ComponentsModule은 Angular에서 코드의 모듈화와 재사용성을 촉진하기 위한 모듈 중 하나이며, 
// src/app/components 폴더에 있는 다양한 컴포넌트들을 모아서 관리하는 역할을 합니다.
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    ChatPage,
    ChatBoxComponent,
  ]
})
export class ChatPageModule {}
