import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [SidebarComponent, RouterModule]
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
