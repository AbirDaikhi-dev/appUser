import { Component } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [UserFormComponent],
  providers: [ActivatedRoute],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

}
