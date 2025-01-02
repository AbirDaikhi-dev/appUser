import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should update isLoggedIn and isAdmin based on currentUser', () => {
    // Mocking user observable
    authServiceMock.currentUser = of({ role: 'admin' });

    component.ngOnInit();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.isAdmin).toBeFalse();
  });

  it('should set isLoggedIn and isAdmin to false if no user is logged in', () => {
    // Mocking no user
    authServiceMock.currentUser = of(null);

    component.ngOnInit();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.isAdmin).toBeFalse();
  });

  it('should call AuthService.logout and navigate to login on logout', () => {
    spyOn(component, 'logout').and.callThrough();
    component.logout();

    expect(component.logout).toHaveBeenCalled();
  });

  it('should unsubscribe from authSubscription on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['authSubscription'], 'unsubscribe');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
