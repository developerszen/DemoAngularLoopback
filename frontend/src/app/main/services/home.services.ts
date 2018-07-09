import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenHelper } from '../helpers/token-helper';

@Injectable()
export class HomeService implements Resolve<any>{

  onSistemasChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
     * The Academy App Main Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getSistemas()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getSistemas(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            var token = TokenHelper.getToken();
            if(token != null){
                this.authService.decodeToken(token, data => {
                    if(data.obj != null){
                        console.log(data);
                        this.http.get(`${environment.api_url}/api/usuariosistemas/getSistemasByFkUsuario?fk_usuario=${data.obj.fk_usuario}`).subscribe((response: any) => {
                            this.onSistemasChanged.next(response);
                            resolve(response);
                        }, reject);
                    }
                })
            } 
        });
    }

}
