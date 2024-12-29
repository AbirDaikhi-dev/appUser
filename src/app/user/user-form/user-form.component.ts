import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  userForm!: FormGroup;


  userId = this.route.snapshot.params['id'];

  user = {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }

  ngOnInit(): void {
    // Initialize the form group
    this.userForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      street: [this.user.address.street, [Validators.required]],
      suite: [this.user.address.suite, [Validators.required]],
      city: [this.user.address.city, [Validators.required]],
      zipcode: [this.user.address.zipcode, [Validators.required]],
      latitude: [this.user.address.geo.lat, [Validators.required]],
      longitude: [this.user.address.geo.lng, [Validators.required]],
      phone: [this.user.phone, [Validators.required]],
      website: [this.user.website, [Validators.required]],
      companyName: [this.user.company.name, [Validators.required]],
      catchPhrase: [this.user.company.catchPhrase, [Validators.required]],
      bs: [this.user.company.bs, [Validators.required]]
    });

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
