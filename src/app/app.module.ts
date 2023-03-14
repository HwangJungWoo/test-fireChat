import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// firebase
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
// firebase

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)), // firebase
    provideAuth(() => {
      // Capacitor를 사용하는 네이티브 플랫폼에서는 앱이 종료되더라도 인증 정보를 보존할 수 있도록 로컬 저장소를 이용하여 
      // 인증 정보를 저장해야 합니다. 이 때, IndexedDB를 이용하여 로컬 저장소를 구성할 수 있습니다.
      
      // Capacitor 플러그인이 지원되는 네이티브 플랫폼에서는 IndexedDB를 이용해 로컬 인증 정보를 저장하도록 함
      if (Capacitor.isNativePlatform()) {
        // Firebase 앱 인스턴스와 IndexedDB 로컬 저장소를 이용해 Firebase Authentication 인스턴스를 초기화
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        })
      } else {
        // Capacitor 플러그인이 지원되지 않는 플랫폼에서는 Firebase Authentication 인스턴스를 반환
        return getAuth()
      }
    }),
    provideFirestore(() => getFirestore()) // firebase
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
