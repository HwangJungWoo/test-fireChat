import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

// 구현된 Auth Guard 서비스는 애플리케이션 전역에서 사용자 인증 여부를 검사하여 
// 로그인되지 않은 사용자가 접근할 수 없는 페이지로의 접근을 차단할 수 있습니다.
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
  }

  // CanLoad 인터페이스에서 정의한 canLoad() 메소드를 구현합니다. 
  // 이 메소드는 라우팅 모듈이나 컴포넌트를 로드하기 전에 호출됩니다.
  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
      try {
        // AuthService의 checkAuth() 메소드를 호출하여 사용자 인증 여부를 확인합니다
        const user = await this.authService.checkAuth();
        console.log(user);
        // 만약 사용자가 인증된 경우 true를 반환하여 해당 모듈이나 컴포넌트를 로드하도록 합니다. 
        if (user) {
          return true;
        } 
        // 인증되지 않은 경우, 로그인 페이지로 이동하도록 navigate() 메소드를 호출하고 false를 반환
        else {
          this.navigate('/login');
          return false;
        }
      } catch (e) {
        console.log(e);
        this.navigate('/login');
        return false;
      }
  }

  navigate(url: any) {
    // replaceUrl 옵션을 추가하여 페이지 이동시 브라우저 히스토리에 기록되지 않도록 설정
    this.router.navigate(url, {replaceUrl: true});
  }
}
