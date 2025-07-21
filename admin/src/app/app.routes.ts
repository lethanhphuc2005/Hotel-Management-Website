import { PaymentMethodComponent } from './features/payment-method/payment-method.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UserComponent } from './features/user/user.component';
import { WebsiteContentComponent } from './features/website-content/website-content.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/auth/admin-guard';
import { RoomComponent } from './features/room/room.component';
import { RoomClassComponent } from './features/room-class/room-class.component';
import { MainRoomClassComponent } from './features/main-room-class/main-room-class.component';
import { CommentComponent } from './features/comment/comment.component';
import { ContentTypeComponent } from './features/content-type/content-type.component';
import { ServiceComponent } from './features/service/service.component';
import { DiscountComponent } from './features/discount/discount.component';
import { EmployeeComponent } from './features/employee/employee.component';
import { BookingComponent } from './features/booking/booking.component';
import { BookingMethodComponent } from './features/booking-method/booking-method.component';
import { BookingStatusComponent } from './features/booking-status/booking-status.component';
import { ReviewComponent } from './features/review/review.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FeatureComponent } from './features/feature/feature.component';
import { PaymentComponent } from './features/payment/payment.component';
import { ProfileComponent } from './features/profile/profile.component';
export const routes: Routes = [
  // Trang login riêng biệt, không có layout
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'room', component: RoomComponent },
          { path: 'main-room-class', component: MainRoomClassComponent },
          { path: 'room-class', component: RoomClassComponent },
          { path: 'user', component: UserComponent },
          { path: 'website-content', component: WebsiteContentComponent },
          { path: 'content-type', component: ContentTypeComponent },
          { path: 'booking', component: BookingComponent },
          { path: 'booking-method', component: BookingMethodComponent },
          { path: 'booking-status', component: BookingStatusComponent },
          { path: 'service', component: ServiceComponent },
          { path: 'discount', component: DiscountComponent },
          { path: 'employee', component: EmployeeComponent },
          { path: 'review', component: ReviewComponent },
          { path: 'feature', component: FeatureComponent },
          { path: 'payment-method', component: PaymentMethodComponent },
          { path: 'payments', component: PaymentComponent },
          { path: 'comment', component: CommentComponent },
          { path: 'profile', component: ProfileComponent },
        ],
      },
    ],
  },

  // Redirect khi không khớp route nào
  { path: '**', redirectTo: '/home' },
];
