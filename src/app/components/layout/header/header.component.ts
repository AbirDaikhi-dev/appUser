import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, HttpClientModule],
  providers: [AuthService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // window.location.reload();
    // Subscribe to the user observable to get the latest state
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'admin';
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
