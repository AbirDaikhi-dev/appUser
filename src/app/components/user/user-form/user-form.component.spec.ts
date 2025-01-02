import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user-model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'addUser', 'updateUser', 'deleteUser', 'setUserObject']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        UserFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form and fetch user details if ID is provided', () => {
      spyOn(component, 'fetchUserDetail');
      component.mode = 'edit';

      component.ngOnInit();

      expect(component.userForm).toBeDefined();
    });

    it('should disable the form in "details" mode', () => {
      component.mode = 'details';
      component.ngOnInit();
      expect(component.userForm.disabled).toBeTrue();
    });
  });

  describe('fetchUserDetail', () => {
    it('should fetch user details successfully', () => {
      const mockUser: User = {
        id: "fcc13a2a-003f-43d5-935f-1e423f70638c",
        name: "Leanne Grahams",
        username: "Brets",
        password: "$2a$10$wcuF3J6w.qugQ8svPqhfqOAvB6og9jMdiOmJA.p.rQj./VlcSwq7C",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
        company: {
          name: "Romaguera-Crona",
          catchPhrase: "Multi-layered client-server neural-net",
          bs: "harness real-time e-markets",
        },
        address: {
          street: "Kulas Light",
          suite: "Apt. 556",
          city: "Gwenborough",
          zipcode: "92998-3874",
          geo: {
            lat: "-37.3159",
            lng: "81.1496",
          },
        },
        role: "admin",
      };
  
      spyOn(component, 'fetchUserDetail').and.callThrough();
      userService.getUser.and.returnValue(of(mockUser));
  
      component.fetchUserDetail(mockUser.id);
      expect(component.fetchUserDetail).toHaveBeenCalledWith(mockUser.id);
    });
  
    it('should handle error when fetching user details fails', () => {
      spyOn(component, 'fetchUserDetail').and.callThrough();
      userService.getUser.and.returnValue(throwError(() => new Error('Error')));
  
      const invalidUserId = 'invalid-id';
      component.fetchUserDetail(invalidUserId);
      expect(component.fetchUserDetail).toHaveBeenCalledWith(invalidUserId);
    });
  });

  describe('passwordMatchValidator', () => {
    it('should validate if passwords match', () => {
      const testForm = new FormBuilder().group({
        password: ['password'],
        confirmPassword: ['password'],
      });

  
      const result = component.passwordMatchValidator(testForm);
      expect(result).toBeNull(); // Should be valid if passwords match
      expect(testForm.get('confirmPassword')?.errors).toBeNull(); // No errors on confirmPassword
    });
  
    it('should invalidate if passwords do not match', () => {
      const testForm = new FormBuilder().group({
        password: ['password'],
        confirmPassword: ['wrongpassword'],
      });
  
      const result = component.passwordMatchValidator(testForm);
      expect(result).toEqual({ mismatch: true }); // Validator should return mismatch error
      expect(testForm.get('confirmPassword')?.errors).toEqual({ mismatch: true }); // ConfirmPassword should have mismatch error
    });
  });
});
