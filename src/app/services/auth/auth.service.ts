import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';  // The URL of your JSON server

  constructor(private http: HttpClient, private router: Router) {}

  // Method to handle login
  login(email: string, password: string): Observable<any> {
    // Fetch all users from the backend
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        // Check if any user matches the provided email and password
        const user = users.find((user) => user.email === email && user.password === password);

        if (user) {
          return user;  // If user found, return user data
        } else {
          throw new Error('Invalid credentials');  // If no match, throw error
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of({ error: error.message || 'Login failed. Please try again.' });
      })
    );
  }

  // Store the authenticated user in localStorage
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Logout the user by clearing localStorage
  logout(): void {
    localStorage.removeItem('user');
  }

  // Check if the user is authenticated (i.e., if there's a user in localStorage)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}
