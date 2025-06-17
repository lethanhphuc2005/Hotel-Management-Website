import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent {
  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  isActive(path: string): boolean {
    return this.currentUrl === path;
  }

  isActivej(key: string): boolean {
    const url = this.router.url;

    switch (key) {
      case 'room':
        return (
          url.startsWith('/admin/room') ||
          url.startsWith('/admin/room-class') ||
          url.startsWith('/admin/main-room-class')
        );
      case 'booking':
        return (
          url.startsWith('/admin/booking') ||
          url.startsWith('/admin/booking-method') ||
          url.startsWith('/admin/booking-status')
        );
      case 'content':
        return (
          url.startsWith('/admin/website-content') ||
          url.startsWith('/admin/content-type') ||
          url.startsWith('/admin/comment') ||
          url.startsWith('/admin/review')
        );
      case 'user':
        return (
          url.startsWith('/admin/user') ||
          url.startsWith('/admin/employee')
        );
      case 'feature':
        return (
          url.startsWith('/admin/service') ||
          url.startsWith('/admin/discount')
        );
      case 'payment':
        return (
          url.startsWith('/admin/payment') ||
          url.startsWith('/admin/payment-method')
        )

      default:
        return false;
    }
  }

  isSubmenuActive(paths: string[]): boolean {
    return paths.some((path) => this.isActive(path));
  }
}
