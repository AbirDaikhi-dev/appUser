import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { UserService } from '../../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../../models/user-model';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [ EditUserComponent, HttpClientModule, RouterTestingModule ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user details on init', () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
      website: 'www.johndoe.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 4B',
        city: 'New York',
        zipcode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      },
      company: {
        name: 'John Doe Corp',
        catchPhrase: 'Innovating the future',
        bs: 'business solutions'
      },
      role: 'admin'
    };

    userService.getUser.and.returnValue(of(user));
    spyOn(component, 'fetchUserDetail').and.callThrough();

    fixture.detectChanges();

    expect(component.fetchUserDetail).toHaveBeenCalledWith(user.id);
  });

  it('should handle error if fetching user fails', () => {
    userService.getUser.and.returnValue(throwError('Error fetching user'));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('');
  });
});
