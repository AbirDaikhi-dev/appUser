import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'setUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent], // Add LoginComponent here instead of declarations
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password fields', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should call AuthService.login when form is valid', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    authServiceMock.login.and.returnValue(of({ userId: '12345' }));
    expect(component.errorMessage).toBeNull();
  });

  it('should display an error message when login fails', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    authServiceMock.login.and.returnValue(of({ error: 'Invalid credentials' }));

    expect(component.errorMessage).toBeNull();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should handle error thrown by AuthService', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    authServiceMock.login.and.returnValue(throwError(() => new Error('Network error')));

    expect(component.errorMessage).toBeNull();
  });
});
