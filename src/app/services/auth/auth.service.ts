import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 인증된 사용자의 UID 값을 저장
  public _uid = new BehaviorSubject<any>(null);
  currentUser: any = null;
  
  constructor(
    private fireAuth: Auth,
    private apiService: ApiService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(this.fireAuth, email, password);
      console.log(response);
      if (response.user) {
        // const token = await (await this.fireAuth.currentUser)?.getIdToken();
        // console.log('token', token);
        // const user: any = await this.getUserData(response.user.uid);
        this.setUserData(response.user.uid);
        // return user.type;;
      }
    } catch (err) {
      throw(err);
    }
  }

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    console.log(this.currentUser);
    return this.currentUser?.uid;
  }

  // 로그인이 성공하면 setUserData() 메소드를 호출하여 사용자 UID 값을 BehaviorSubject에 저장
  setUserData(uid: string) {
    this._uid.next(uid);
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async register(formValue: any) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
      console.log('registerUser user: ', registeredUser);
      const data = {
        email: formValue.email,
        name: formValue.username,
        uid: registeredUser.user.uid,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400)
      }
      await this.apiService.setDocument(`users/${registeredUser.user.uid}`, data);
      const userData = {
        id: registeredUser.user.uid
      }
      return userData;
    } catch (err) {
      throw(err);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (err) {
      throw(err);
    }
  }


  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next(null);
      return true;
    } catch (err) {
      throw(err);
    }
  }


  // checkAuth() 메소드는 Firebase Auth 서비스를 이용하여 현재 사용자 인증 상태를 확인합니다. 
  // onAuthStateChanged() 메소드를 호출하여 현재 사용자 인증 상태에 대한 변경사항을 관찰합니다. 
  // 이때, 콜백 함수에서 인증된 사용자를 BehaviorSubject에 저장합니다.
  checkAuth(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, user => {
        console.log('auth user: ', user);
        resolve(user);
      });
    });
  }

  async getUserData(id: string) {
    const docSnap = await this.apiService.getDocById(`users/${id}`);
    if (docSnap?.exists()) {
      return docSnap.data();
    } else {
      throw('No such document exists');
    }
  }
}
