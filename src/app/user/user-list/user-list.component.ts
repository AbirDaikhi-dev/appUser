import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user-modal';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/userService/user.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ HttpClientModule, RouterModule],
  providers: [UserService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  private router = inject(Router);
  private userService = inject(UserService);
  users: User[] = [];
  errorMessage: string = 'Cannot Fetch User'; // To handle errors


  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to fetch users.';
      }
    });
  }

  deleteUser(userId: any) {
    this.userService.deleteUser(userId).subscribe();
   
    }
  
}
 