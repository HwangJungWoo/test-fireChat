import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  // item 데이터를 받아옴, 부모 컴포넌트에서 전달된 데이터를 받아오는 프로퍼티
  @Input() item: any;
  // @Output 데코레이터를 사용하여 onClick 이벤트를 발생
  // @Output 데코레이터를 사용하여 자식 컴포넌트에서 발생시킨 이벤트를 부모 컴포넌트로 전달하는 프로퍼티
  // EventEmitter 클래스를 사용하여 onClick 이벤트를 정의하고, 
  // any 타입으로 정의되어 있어서 어떠한 형태의 데이터도 전달
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log("onInit", this.item);
  }

  // 이벤트를 발생시키는 역할
  // 이 메소드에서는 this.onClick.emit() 메소드를 호출하면서 this.item을 인자로 전달
  // UserListComponent에서 발생한 onClick 이벤트를 부모 컴포넌트로 전달
  redirect() {
    this.onClick.emit(this.item);
  }

}
