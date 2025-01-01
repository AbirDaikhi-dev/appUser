import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../user-modal';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/userService/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Angular Material SnackBar
import { MatDialog } from '@angular/material/dialog'; // Angular Material Dialog
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [ReactiveFormsModule, HttpClientModule, NgClass, NgIf],
  providers: [UserService],
})
export class UserFormComponent implements OnInit {
  @Input() mode: 'edit' | 'create' | 'details' = 'create'; // Accepts mode from parent
  @Input() user?: User;

  private userService = inject(UserService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar =  inject(MatSnackBar);
  private dialog = inject(MatDialog);



  errorMessage: string = 'Cannot Fetch User'; 

  userForm!: FormGroup;
  userId!: any | undefined;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.user)
    this.activatedRoute.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.fetchUserDetail(userId);
      }
    });
    this.initializeForm(this.user || ({} as User));

    // Disable form in 'details' mode
    if (this.mode === 'details') {
      this.userForm.disable();
    }
  }
  fetchUserDetail(userId: number) {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to fetch user details.';
      },
    });
  }

  initializeForm(user: User): void {
    this.userForm = this.fb.group({
      name: [user.name || '', [Validators.required]],
      username: [user.username || '', [Validators.required]],
      email: [user.email || '', [Validators.required, Validators.email]],
      password: [user.password || '', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      street: [user?.address?.street || '', [Validators.required]],
      suite: [user?.address?.suite || '', [Validators.required]],
      city: [user?.address?.city || '', [Validators.required]],
      zipcode: [user?.address?.zipcode || '', [Validators.required]],
      latitude: [user?.address?.geo?.lat || '', [Validators.required]],
      longitude: [user?.address?.geo?.lng || '', [Validators.required]],
      phone: [user.phone || '', [Validators.required]],
      website: [user.website || '', [Validators.required]],
      companyName: [user?.company?.name || '', [Validators.required]],
      catchPhrase: [user?.company?.catchPhrase || '', [Validators.required]],
      bs: [user?.company?.bs || '', [Validators.required]],
    }, {
      // Custom validator to check if password and confirmPassword match
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  submitUserForm(): void {
    const users = this.userService.getAllUsers(); // Get the list of existing users (for UUID generation)
  
    const user = this.userService.setUserObject(this.userForm.value, users); // Get user with UUID and hashed password
  
    if (this.userId) {
      // Update user if an ID exists
      this.userService.updateUser(this.userId, user).subscribe({
        next: () => {
          this.showAlert('User updated successfully!', 'success');
        },
        error: () => {
          this.showAlert('Failed to update user.', 'error');
        },
      });
    } else {
      // Add user if no ID exists (new user)
      this.userService.addUser(user).subscribe({
        next: () => {
          this.showAlert('User created successfully!', 'success');
          this.userForm.reset();
        },
        error: () => {
          this.showAlert('Failed to create user.', 'error');
        },
      });
    }
  }
  
  

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;

    // Automatically hide the alert after 5 seconds
    setTimeout(() => this.closeAlert(), 5000);
  }

  closeAlert() {
    this.alertMessage = null;
    this.alertType = null;
  }
  
  editUser(user: any) {
      this.router.navigate(['/edit-user', user.id]);
    }

    deleteUser(userId: any) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { message: 'Are you sure you want to delete this user?' },
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userService.deleteUser(userId).subscribe({
            next: () => {
              this.snackBar.open('User deleted successfully!', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success'],
              });
              this.router.navigate(['/users']);
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error deleting user!', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error'],
              });
            },
          });
        }
      });
    }
}
