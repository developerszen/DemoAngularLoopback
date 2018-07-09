import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthHttpService } from '../../services/auth.http.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDetalleService {

  constructor(private http: AuthHttpService) { }

  public getSistemasByUserId(data,action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.get(`${environment.api_url}/api/usuariosistemas/getSistemasByFkUsuario`,data).subscribe(
        data => action(data),
        error => console.log(error))
  }
  public getSistemasNoAsignadosByUserId(data,action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.get(`${environment.api_url}/api/usuariosistemas/getSistemasNoAsignadosByFkUsuario`,data).subscribe(
        data => action(data),
        error => console.log(error))
  }
  public insertSistemasNoAsignados(postData: any,action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.post(`${environment.api_url}/api/usuariosistemas/insertUsuariosSistemas`,postData).subscribe(
        data => action(data),
        error => console.log(error))
  }
  public deleteUsuariosSistemas(postData: any,action: (data: any) => any, actionError?: (data: any) => any) {
    console.log(postData)
    return this.http.post(`${environment.api_url}/api/usuariosistemas/deleteUsuariosSistemas`,postData).subscribe(
        data => action(data),
        error => console.log(error))
  }
  public getUsuarioById(fk_usuario,action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.get(`${environment.api_url}/api/usuarios/${fk_usuario}`).subscribe(
        data => action(data),
        error => console.log(error))
  }
}