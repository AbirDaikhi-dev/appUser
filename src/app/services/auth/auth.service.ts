import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';  // The URL of your JSON server
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize the user state based on localStorage or sessionStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));  // Initialize the observable with the user
    }
  }

  // Method to handle login
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((user) => user.email === email);

        if (user) {
          if (this.checkPassword(password, user.password)) {
            this.setUser(user);  // Store user details in localStorage
            return user;  // Return user data
          } else {
            throw new Error('Invalid password');
          }
        } else {
          throw new Error('User not found');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return new Observable<any>((observer) => observer.error(error.message || 'Login failed.'));
      })
    );
  }

  // Utility to check password (replace with real hash comparison if needed)
  private checkPassword(inputPassword: string, storedPassword: string): boolean {
    return bcrypt.compareSync(inputPassword, storedPassword);
  }

  // Store the authenticated user in localStorage and notify other parts of the app
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));  // Store the full user object
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    this.currentUserSubject.next(user);  // Update the BehaviorSubject with the logged-in user
  }

  // Clear user data from localStorage (logout) and notify other parts of the app
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);  // Reset the current user observable
  }

  // Utility: Get the logged-in user's role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Utility: Get the logged-in user's ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Return the current user object (can be used to get user details)
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
