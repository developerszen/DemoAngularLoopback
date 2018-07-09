import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttpService } from './auth.http.service';
import { AuthService } from './auth.service';

@Injectable()
export class PerfilesService {
    constructor(private http: AuthHttpService, private authService: AuthService) {
    }

    public getPerfiles(action: (data: any) => any, actionError?: (data: any) => any) {
        return this.http.get(`${environment.api_url}/api/perfils/getPerfiles`).subscribe(
            data => action(data),
            error => console.log(error)
        );
    }
}