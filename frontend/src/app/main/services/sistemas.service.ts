import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttpService } from './auth.http.service';
import { AuthService } from './auth.service';



@Injectable()
export class SistemasService {
    constructor(private http: AuthHttpService, private authService: AuthService) {
    }

    public getSistemas(data,action: (data: any) => any, actionError?: (data: any) => any) {
        let parametros = this.authService.getParametrosSearch({ data });
        return this.http.get(`${environment.api_url}/api/sistemas/getSistemas`,data).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }
}