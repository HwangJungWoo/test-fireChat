import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';



@NgModule({
  declarations: [EmptyScreenComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [EmptyScreenComponent] // 이 부분 추가
})
export class ComponentsModule { }
