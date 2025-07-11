import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  isActive = false;
  isRegister = false;
  loginForm!: FormGroup;
  registerF!: FormGroup;
  constructor(private authService: AuthService, private router: Router, private Toastr: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
    this.registerF = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl('', Validators.required)
    })
    this.registerF.setValidators(this.passwordMatchValidator());
  }

  ngOnInit() {
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('rePassword')?.value;

      if (password !== confirmPassword) {
        return { mismatch: true };
      } else {
        return null;
      }

    }
  }
  onLogin() {
    if (this.loginForm.invalid) {
      this.Toastr.error('Dữ liệu không hợp lệ', 'Lỗi đăng nhập');
      return;
    } else {
      this.authService.login(this.loginForm.value).subscribe(data => {
        if (data.status === false) {
          this.Toastr.error(data.message, 'Lỗi đăng nhập');
          return;
        }
        this.Toastr.success('Đăng nhập thành công', 'Thông báo');
        const jsonData = JSON.stringify(data.data);
        localStorage.setItem('login', jsonData);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      })
    }
  }
  onRegister() {
    if (this.registerF.invalid) {
      alert('Dữ liệu không hợp lệ')
    } else {
      this.authService.register(this.registerF.value).subscribe(data => {
        alert('Bạn đã đăng ký thành công')
      })
    }
    console.log(this.registerF)
  }
  toggleForm() {
    this.isActive = !this.isActive;
    this.isRegister = !this.isRegister;
  }

}
