import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs'; 
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private users: any[] = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: any): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: any, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: any): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  private getNextId(): number {
    // If there are no users, start with ID 1
    if (this.users.length === 0) {
      return 1;
    }

    // Otherwise, get the highest ID and increment by 1
    const highestId = Math.max(...this.users.map(user => user.id));
    return highestId + 1;
  }

  getAllUsers(): User[] {
    // This could be a call to your API or fetching data from local storage or an in-memory array
    return this.users;  // Assuming `this.users` is the list of users
  }
  

  setUserObject(user: any, userId?: any): User {
    const newId = uuidv4(); // Generate a new UUID for the user id
    const userObject: User = {
      id: user.id ? userId : newId,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      company: {
        name: user.companyName,
        catchPhrase: user.catchPhrase,
        bs: user.bs
      },
      address: {
        street: user.street,
        suite: user.suite,
        city: user.city,
        zipcode: user.zipcode,
        geo: {
          lat: user.latitude,
          lng: user.longitude
        }
      }, 
      role : 'user'
    };
    
    if (user.password) {
      userObject.password = this.hashPassword(user.password);  // Store the hashed password
    }
  
    return userObject;
  }
  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10); // Generate a salt
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password
    return hashedPassword;
  }
}
