import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {

  }
}
