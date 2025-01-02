import { Component, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../models/user-model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,  
  imports: [ HttpClientModule, UserFormComponent, RouterModule],
  providers: [UserService],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {

  private router = inject(ActivatedRoute);
  private userService = inject(UserService);
  user!: User;
  errorMessage: string = 'Cannot Fetch User'; 
 
 
   ngOnInit() {
    this.router.params.subscribe((params) => {
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
        this.errorMessage = 'Failed to fetch user.';
      }
    });
  }
}
