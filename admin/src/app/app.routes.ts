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
import { RoomClassListComponent } from './components/admin/room-class-list/room-class-list.component';
import { MainRoomClassComponent } from './components/admin/main-room-class/main-room-class.component';
import { CommentComponent } from './components/admin/comment/comment.component';
import { CommentItemComponent } from './components/admin/comment/comment-item/comment-item.component';
import { ContentTypeComponent } from './components/admin/content-type/content-type.component';
import { ServiceComponent } from './components/admin/service/service.component';
import { DiscountComponent } from './components/admin/discount/discount.component';
import { EmployeeComponent } from './components/admin/employee/employee.component';
import { BookingComponent } from './components/admin/booking/booking.component';
import { BookingMethodComponent } from './components/admin/booking-method/booking-method.component';
import { BookingStatusComponent } from './components/admin/booking-status/booking-status.component';
import { ReviewComponent } from './components/admin/review/review.component';
export const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'admin', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
          { path: 'room-list', component: RoomListComponent },
          { path: 'main-room-class', component: MainRoomClassComponent },
          { path: 'room-class-list', component: RoomClassListComponent },
          { path:'user', component: UserComponent },
          { path:'websitecontent', component: WebsitecontentComponent },
          { path:'content-type', component: ContentTypeComponent },
          { path:'booking', component: BookingComponent },
          { path:'booking-method', component: BookingMethodComponent },
          { path:'booking-status', component: BookingStatusComponent },
          { path:'service', component: ServiceComponent },
          { path:'discount', component: DiscountComponent },
          { path:'employee', component: EmployeeComponent },
          { path:'review', component: ReviewComponent },
          { path:'comment', component: CommentComponent,
             children: [
                 { path:'comment-item', component: CommentItemComponent}
             ]
          },
    ]
  },
  { path: '**', redirectTo: '/home' },
];

