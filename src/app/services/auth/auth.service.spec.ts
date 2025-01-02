import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUsers = [
    {
      id: 1,
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'user'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Ensure that there are no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should login successfully if email and password are correct', () => {
      spyOn(service, 'setUser').and.callThrough();

      service.login('test@example.com', 'password123').subscribe(user => {
        expect(user).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(service.setUser).toHaveBeenCalled();
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should throw an error if user is not found', () => {
      service.login('nonexistent@example.com', 'password123').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error).toBe('Http failure response for http://localhost:3000/users: 404 Not Found');
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush([], { status: 404, statusText: 'Not Found' });
    });

    it('should throw an error if password is incorrect', () => {
      service.login('test@example.com', 'wrongpassword').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error).toBe('Invalid password');
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });
  });

  describe('logout()', () => {
    it('should logout and clear user data from localStorage', () => {
      const user = mockUsers[0];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('userRole', user.role);

      service.logout();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('getUserRole()', () => {
    it('should return the user role from localStorage', () => {
      localStorage.setItem('userRole', 'admin');

      const role = service.getUserRole();
      expect(role).toBe('admin');
    });

    it('should return null if no role is found', () => {
      localStorage.removeItem('userRole');

      const role = service.getUserRole();
      expect(role).toBeNull();
    });
  });

  describe('getUserId()', () => {
    it('should return the user ID from localStorage', () => {
      localStorage.setItem('userId', '1');

      const userId = service.getUserId();
      expect(userId).toBe('1');
    });

    it('should return null if no user ID is found', () => {
      localStorage.removeItem('userId');

      const userId = service.getUserId();
      expect(userId).toBeNull();
    });
  });

  describe('setUser()', () => {
    it('should store user data in localStorage and update the currentUser observable', () => {
      const user = mockUsers[0];

      service.setUser(user);

      expect(localStorage.getItem('user')).toEqual(JSON.stringify(user));
      expect(localStorage.getItem('userId')).toEqual(user.id.toString());
      expect(localStorage.getItem('userRole')).toEqual(user.role);

      service.currentUser.subscribe((currentUser) => {
        expect(currentUser).toEqual(user);
      });
    });
  });

  describe('checkPassword()', () => {
    it('should return true if password is correct', () => {
      const correctPassword = 'password123';
      const hashedPassword = bcrypt.hashSync(correctPassword, 10);

      const result = service['checkPassword'](correctPassword, hashedPassword);
      expect(result).toBeTrue();
    });

    it('should return false if password is incorrect', () => {
      const correctPassword = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = bcrypt.hashSync(correctPassword, 10);

      const result = service['checkPassword'](wrongPassword, hashedPassword);
      expect(result).toBeFalse();
    });
  });
});
