
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHeaderService {
  [x: string]: any;


  getAuthHeadersOrEmpty(): HttpHeaders | null {
    const loginDataStr = localStorage.getItem('login');
    if (!loginDataStr) {
      return null;
    }

    try {
      const loginData = JSON.parse(loginDataStr);
      const accessToken = loginData?.data?.accessToken;

      if (!accessToken) {
        return null;
      }

      return new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });
    } catch (e) {
      return null;
    }
  }


}
