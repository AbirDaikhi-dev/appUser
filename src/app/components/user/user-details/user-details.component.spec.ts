import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../../services/user/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../../models/user-model';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;

  const mockActivatedRoute = {
    params: of({ id: '123' }),
  };

  const mockUser : User = {
    id: '123',
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'hashedpassword',
    phone: '123-456-7890',
    website: 'https://johndoe.com',
    company: {
      name: 'Doe Inc',
      catchPhrase: 'Innovation',
      bs: 'Tech',
    },
    address: {
      street: '123 Main St',
      suite: 'Apt 1',
      city: 'Metropolis',
      zipcode: '12345',
      geo: {
        lat: '10',
        lng: '20',
      },
    },
    role: 'user',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,           // HTTP testing
        RouterTestingModule,               // To handle routing during testing
        UserFormComponent,                 // Include the UserFormComponent since it's part of the standalone
      ],
      providers: [
        UserService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user details on init', waitForAsync(() => {
    // Spy on the service
    spyOn(userService, 'getUser').and.returnValue(of(mockUser));
    spyOn(component, 'fetchUserDetail').and.callThrough();

    // Trigger ngOnInit
    fixture.detectChanges();

    // Wait for the async HTTP request to complete
    fixture.whenStable().then(() => {
      // Assert that the user details were fetched
      expect(component.fetchUserDetail).toHaveBeenCalledWith(mockUser.id);
    });
  }));

  it('should handle error if fetching user fails', waitForAsync(() => {
    // Simulate an error
    spyOn(userService, 'getUser').and.returnValue(throwError(() => new Error('Failed to fetch user')));

    // Trigger ngOnInit
    fixture.detectChanges();

    // Wait for the async HTTP request to complete
    fixture.whenStable().then(() => {
      // Assert that the error message was set
      expect(component.errorMessage).toEqual('Failed to fetch user.');
    });
  }));
});
