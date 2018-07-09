import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttpService } from './auth.http.service';
import { AuthService } from './auth.service';



@Injectable()
export class UsuariosService {
    constructor(private http: AuthHttpService, private authService: AuthService) {
    }

    public getUsuarios(data, action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ data });
        return this.http.get(`${environment.api_url}/api/usuarios/getUsuarios`, parametros).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }

    public updatePerfil(postData, action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ postData });
        return this.http.post(`${environment.api_url}/api/usuarios/updatePerfil`, parametros).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }
}