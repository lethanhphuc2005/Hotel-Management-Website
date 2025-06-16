import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule, HttpClientModule]
})
export class HomeComponent implements OnInit {

 constructor(private router: Router, private authService: AuthService) {}


  ngOnInit() {
  }
logout() {
  localStorage.removeItem('login');
  this.authService.logout();
  alert('Bạn đã đăng xuất');
}
}
