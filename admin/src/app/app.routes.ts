import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { RoomListComponent } from './components/admin/room-list/room-list.component';


export const routes: Routes = [
  {path: 'header', component: HeaderComponent},
  {path: 'footer', component: FooterComponent},
  {path: 'home', component: HomeComponent},
  // {path: 'phong', component: PhongComponent},
   {path: 'admin',component:DashboardComponent,
      children:[
         { path: '', component: DashboardComponent },
        {path:'room-list', component: RoomListComponent}
      ]
    },
  {path: '**', redirectTo : '/home'},
];

