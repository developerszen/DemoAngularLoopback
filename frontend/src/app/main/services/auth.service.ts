import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { URLSearchParams } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  public isLoggedIn(token,action: (data: any) => any, actionError?: (data: any) => any) {
    console.log(token)
    return this.http.get(`${environment.api_url}/api/tokens/verifyToken?access_token=${token}`).subscribe(
        data => action(data),
        error => console.log(error))
  }

  public login(postData, action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.post(`${environment.api_url}/api/usuarios/authenticate`, postData)
        .subscribe(
            data => action(data),
            error => console.log(error)
        );
  }

  public logout() {
    localStorage.removeItem('authServerToken');
    this.router.navigateByUrl('/login');
  }
   
  /**
   * registrarToken
   * * Registra el token
   * @param postData datos para el registro del token
   */
  public registrarToken(postData, action: (data: any) => any, actionError?: (data: any) => any){
    return this.http.post(`${environment.api_url}/api/tokens`,postData).subscribe(
      data => {
        action(data)
      },
      error => {
        console.log(error)
        this.snackBar.open("Lo sentimos ha ocurrido un error","Cerrar")
      }
    )
  }

  public decodeToken(token: string, action: (data: any) => any, actionError?: (data: any) => any){
    return this.http.get(`${environment.api_url}/api/tokens/decodeToken?token=${token}`).subscribe(data => {
      action(data)
    },
    error => {
      console.log(error)
      this.snackBar.open('Lo sentimos ha ocurrido un error','Cerrar')
    }
    )
  }

  public getIpAddress(action: (data: any) => any, actionError?: (data: any) => any) {
    this.http.get('https://jsonip.com')
      .subscribe(data => {
         action(data)
      },
    error => {
      console.log(error)
    })
  }

  public getParametrosSearch(array: any) {
    let parametros: URLSearchParams = new URLSearchParams();
    for (var val in array) {
        for (var key in array[val]) {
            var value = array[val][key];
            parametros.set(key, value);
        }
    }
    return parametros;
}
}
