import { Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserFormComponent } from './user/user-form/user-form.component';

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
        component: UserFormComponent
    },
    {
        path: 'edit-user/:id',
        component: UserFormComponent
    },
    {
        path: '**',
        redirectTo: 'users'
    }
];
