import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { TokenHelper } from '../helpers/token-helper';

@Injectable()
export class AuthHttpService
{
    constructor(private http: Http) {}

    public get<T2>(urll: string, params?: URLSearchParams): Observable<T2> {
        let options = new RequestOptions();
        options.headers = new Headers();
        if (params != null) {
            options.search = params;
        }
        options = this.appendAcessToken(options);
        return this.getWithOptions<T2>(urll, options);
    }

    public getWithOptions<T2>(urll: string, options: RequestOptions): Observable<T2> {
        return this.http.get(urll, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public post<T, T2>(urll: string, data: T): Observable<T2> {
        let options = new RequestOptions();
        options.headers = new Headers();
        options = this.appendAcessToken(options);
        return this.postWithOptions<T, T2>(urll, data, options);
    }
    
    public postWithOptions<T, T2>(urll: string, data: T, options: RequestOptions): Observable<T2> {
        return this.http.post(urll, data, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public put<T, T2>(urll: string, data: T): Observable<T2> {
        let options = new RequestOptions();
        options.headers = new Headers();
        options = this.appendAcessToken(options);
        return this.putWithOptions<T, T2>(urll, data, options);
    }

    public putWithOptions<T, T2>(urll: string, data: T, options: RequestOptions): Observable<T2> {
        return this.http.put(urll, data, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public appendAcessToken(options: RequestOptions): any {
        let appendAcessToken =  TokenHelper.getToken()
        console.log(appendAcessToken)
        if (appendAcessToken != null) {
            options.headers.append("access_token", appendAcessToken);
        }
        return options;
    }

    private extractData(res: Response) {
        let body = res.json();
        if (body.data == null) {
            return body;
        }
        return body.data || {};
    }

    public handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        console.log("ENTRANDO AL HANDLE");
        console.log(error);
        let errMsg: string;
        if (error instanceof Response) {
            // en caso que no haya permisos votamos al usuario
            if (error.status == 403 || error.status == 401) {
                console.log("NO HAY PERMISOS REGRESANDO A LA PANTALLA INICIAL");
                sessionStorage.clear();
                window.location.href = "/";
            }

            console.log(error.status);
            /* const body = error.json() || '';
             const err = body.error || JSON.stringify(body);
             errMsg = `${error.status} - ${error.statusText || ''} ${err}`;*/

        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        //alert("Sesi\u00F3n Expirada");
        return Observable.throw(errMsg);
    }
}
