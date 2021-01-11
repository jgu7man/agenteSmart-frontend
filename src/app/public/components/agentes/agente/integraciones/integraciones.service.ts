import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegracionesService {

  url: string = environment.restURL + 'whatsapp'
  constructor (
    private _http: HttpClient
  ) { }



  getQRCode(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    return this._http.get(this.url, {headers: headers})  
  }
}
