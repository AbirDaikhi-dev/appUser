import { Component, inject } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../user-modal';
import { UserService } from '../../services/userService/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [UserFormComponent, HttpClientModule, RouterModule],
  providers: [UserService],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

    user!: User;
    private userService = inject(UserService);
    private activatedRoute = inject(ActivatedRoute);
    errorMessage: string = '';
    
    ngOnInit() {
      this.activatedRoute.params.subscribe((params) => {
        const userId = params['id'];
        if (userId) {
          this.fetchUserDetail(userId);
        }
      });
    }

    fetchUserDetail(userId: any) {
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
}
