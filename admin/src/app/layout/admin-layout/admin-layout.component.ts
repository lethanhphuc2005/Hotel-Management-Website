import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule]
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
