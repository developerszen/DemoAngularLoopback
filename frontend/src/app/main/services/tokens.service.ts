import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthHttpService } from './auth.http.service';
import { AuthService } from './auth.service';

@Injectable()
export class TokensService {

  constructor(private http: AuthHttpService, private authService: AuthService) { }

  public getTokens(data, action: (data: any) => any, actionError?: (data: any) => any) {
    let parametros = this.authService.getParametrosSearch({ data });

    return this.http.get(`${environment.api_url}/api/tokens/getTokens`,parametros).subscribe(
      data => action(data),
      error => console.log(error))
  }

  public getLocalStorageToken() {
    var token = localStorage.getItem('authServerToken')
    if (token != null) {
      var tokenStored = JSON.parse(token);
      return tokenStored.obj.token
    }
    return null
  }

  public deshabilitarToken(postData, action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.post(`${environment.api_url}/api/tokens/deshabilitarToken`,postData).subscribe(
      data => action(data),
      error => console.log(error)
    )
  }
}
