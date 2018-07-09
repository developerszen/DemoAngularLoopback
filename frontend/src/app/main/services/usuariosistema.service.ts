import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttpService } from './auth.http.service';
import { AuthService } from './auth.service';

@Injectable()
export class UsuarioSistemaService {
    constructor(private http: AuthHttpService, private authService: AuthService) {
    }

    public getUsuariosByFkSistema(data,action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ data });
        return this.http.get(`${environment.api_url}/api/usuariosistemas/getUsuariosByFkSistema`,data).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }

    public getUsuariosInSistema(data,action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ data });
        return this.http.get(`${environment.api_url}/api/usuariosistemas/getUsuariosInSistema`,parametros).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }

    public getUsuariosNotInSistema(data,action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ data });
        return this.http.get(`${environment.api_url}/api/usuariosistemas/getUsuariosNotInSistema`,parametros).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }

    public insertUsuariosNoAsignados(postData: any,action: (data: any) => any, actionError?: (data: any) => any) {
        return this.http.post(`${environment.api_url}/api/usuariosistemas/insertUsuariosSistemas`,postData).subscribe(
            data => action(data),
            error => console.log(error))
      }
}