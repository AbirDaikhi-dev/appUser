import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user/:id',
        component: UserDetailsComponent
    },
    {
        path: 'add-user',
        component: CreateUserComponent
    },
    {
        path: 'edit-user/:id',
        component: EditUserComponent,
        canActivate: [AuthGuard]

    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
