import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Angular Material SnackBar
import { MatDialog } from '@angular/material/dialog'; // Angular Material Dialog
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from '../../../models/user-model';
import { UserService } from '../../../services/user/user.service';

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
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);



  errorMessage: string = 'Cannot Fetch User';

  userForm!: FormGroup;
  userId!: any | undefined;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private fb: FormBuilder) { }

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
      password: ['', []],
      confirmPassword: ['', []],
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
    
    // Conditionally apply required validators for password and confirmPassword
    if (this.mode === 'create') {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      // Clear validators if mode is not 'create'
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
    }
    
    // Update the form status (if needed)
    this.userForm.updateValueAndValidity();
    
  }
    

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
  
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      group.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
  

  submitUserForm(): void {
    if (this.userForm.valid) {

    if (this.mode === 'create') {
      const userData = this.userService.setUserObject(this.userForm.value);
              // Add user if no ID exists (new user)
              this.userService.addUser(userData).subscribe({
                next: () => {
                  this.snackBar.open('User created successfully', 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-success'],
                  });
                  this.userForm.reset();
                  this.router.navigate(['/users']);

                },
                error: () => {
                  this.snackBar.open('Failed to create user.', 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-error'],
                  });
                },
              });
    } else {
      const userData = this.userService.setUserObject(this.userForm.value, this.user?.id);
      this.userService.updateUser(this.user?.id, userData).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/users']);
        },
        error: () => {
          this.snackBar.open('Failed to update user.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    }

    } else {
      // Highlight invalid fields and display a global error message
      this.markAllAsTouched(); // Mark all controls as touched to trigger validation messages
      this.showAlert('Please correct the errors in the form.', 'error');
    }
  }
  
  /**
   * Marks all form controls as touched to display validation errors.
   */
  private markAllAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(field => {
      const control = this.userForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  
    // Handle nested form controls (like address and company)
    ['address', 'geo', 'company'].forEach(groupName => {
      const group = this.userForm.get(groupName) as FormGroup;
      if (group) {
        Object.keys(group.controls).forEach(field => {
          const control = group.get(field);
          if (control) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
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
