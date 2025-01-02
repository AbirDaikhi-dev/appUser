import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Variable to store error message
  errorMessage: string | null = null;

  // Login function
  login(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // Call the login method in AuthService
    this.authService.login(email, password).subscribe((response) => {
      if (response.error) {
        // If there's an error (invalid credentials), set the error message
        this.errorMessage = response.error;
      } else {
        // If login is successful, clear any previous errors and store the user
        this.errorMessage = null;  // Clear the error message
        this.authService.setUser(response);
        this.router.navigate(['/user', localStorage.getItem('userId')]);
      }
    });
  }
}
