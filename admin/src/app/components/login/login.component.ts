import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService,  private router: Router) {
    this.loginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      MatKhau: new FormControl('', [Validators.required, Validators.minLength(2)]),
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
      alert('Dữ liệu không hợp lệ')
  } else {
      this.authService.login(this.loginForm.value).subscribe(data => {
          // alert('Bạn đã đăng nhập thành công');

          let jsonData = JSON.stringify(data);
          console.log(jsonData)
          localStorage.setItem('login', jsonData);
          location.assign('/home');
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
