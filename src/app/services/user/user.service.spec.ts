import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';


describe('UserService', () => {
  let service: UserService;
  let httpClientMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientMock },
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUserObject()', () => {
    it('should return a properly formatted user object with a new UUID', () => {
      const mockUser = {
        name: 'John',
        username: 'john123',
        email: 'john@example.com',
        password: 'password123',
        companyName: 'Company Inc.',
        catchPhrase: 'Innovative solutions',
        bs: 'Tech',
        street: '123 Main St',
        suite: 'Apt 101',
        city: 'New York',
        zipcode: '10001',
        latitude: '40.7128',
        longitude: '-74.0060'
      };

      const mockAddress = {
        street: '123 Main St',
        suite: 'Apt 101',
        city: 'New York',
        zipcode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      };

      const userObject = service.setUserObject(mockUser);

      expect(userObject.password).toBeDefined();
      expect(userObject.role).toBe('user');
      expect(userObject.name).toBe('John');
      expect(userObject.email).toBe('john@example.com');
      expect(userObject.address).toEqual(mockAddress);
    });
  });

});
