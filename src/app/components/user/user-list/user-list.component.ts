import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; 
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../models/user-model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ HttpClientModule, RouterModule],
  providers: [UserService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
addUser() {
throw new Error('Method not implemented.');
}

  private router = inject(Router);
  private userService = inject(UserService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
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
            this.router.navigate([this.router.url], { skipLocationChange: true }).then(() => {
              this.router.navigate([this.router.url]);
            });          },
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
 