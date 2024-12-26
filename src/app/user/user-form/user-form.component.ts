import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userId = this.route.snapshot.params['id'];
  userForm = this.fb.group({
    name: [''],
    username: [''],
    email: [''],
    address: this.fb.group({
      street: [''],
      suite: [''],
      city: [''],
      zipcode: [''],
      geo: this.fb.group({
        lat: [''],
        lng: [''],
      }),
    }),
    phone: [''],
    website: [''],
    company: this.fb.group({
      name: [''],
      catchPhrase: [''],
      bs: [''],
    }),
    role: [''],
  });

  ngOnInit() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        this.userForm.patchValue(user);
      });
    }
  }

  saveUser() {
    const user = this.userForm.value;
    if (this.userId) {
      this.userService.updateUser(this.userId, user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.addUser(user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
