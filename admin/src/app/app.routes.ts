import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { UserComponent } from './components/admin/user/user.component';
import { WebsitecontentComponent } from './components/admin/websitecontent/websitecontent.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './components/auth/admin-guard';
import { RoomListComponent } from './components/admin/room-list/room-list.component';
import { RoomAddComponent } from './components/admin/roomlist-add/roomlist-add.component';
import { RoomTypeListComponent } from './components/admin/roomtype-list/roomtype-list.component';
import { RoomTypeMainComponent } from './components/admin/roomtype-main/roomtype-main.component';

export const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {path:'', redirectTo: '/login', pathMatch: 'full'},
  {path: 'admin',component: AdminLayoutComponent,canActivate: [AuthGuard],
    children: [
          { path: 'room-list', component: RoomListComponent },
          { path: 'roomlist-add', component: RoomAddComponent },
          { path: 'roomtype-list', component: RoomTypeListComponent },
          { path: 'roomtype-main', component: RoomTypeMainComponent },
          // { path: '', redirectTo: 'room-list', pathMatch: 'full' },
          { path:'user', component: UserComponent },
          { path:'websitecontent', component: WebsitecontentComponent },
        ]
      },
    { path: '**', redirectTo : '/home' },
];

