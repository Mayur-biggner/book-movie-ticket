import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifyOtpService {

  constructor(private _httpService:HttpService) { }


  verifyOtp(mobile: string, otp: string) {
    const url = `${environment.apiUrl}verify-otp`;
    const body = { mobile, otp };
    return this._httpService.request('POST', url, body);
  }
}
