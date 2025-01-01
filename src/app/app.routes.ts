import { Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
    },
    {
        path: 'users',
        component: UserListComponent
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
        component: EditUserComponent
    },
    {
        path: '**',
        redirectTo: 'users'
    }
];
