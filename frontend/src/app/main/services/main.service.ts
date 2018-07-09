import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class MainService {

  constructor(private http: HttpClient){}

  public getMenu(fk_perfil,action: (data: any) => any, actionError?: (data: any) => any) {
    return this.http.get(`${environment.api_url}/api/menuperfils/getMenu?fk_perfil=${fk_perfil}`).subscribe(
        data => {
            var array = this.convertirFormatoMenu(data)
            action(array)
        },
        error => console.log(error))
  }
  public convertirFormatoMenu(data){
      let array = []
      for (let index = 0; index < data.length; index++) {
          if(data[index].cant_hijos>0){
            let arrayChildren = []
            for (let index2 = 0; index2 < data.length; index2++) {
                if(data[index2].id_padre = data[index].id){
                    let objChildren = {
                        'id': data[index2].id,
                        'title': data[index2].menu,
                        'type': data[index2].tipo,
                        'icon':data[index2].icono,
                        'url':data[index2].path
                    }  
                    arrayChildren.push(objChildren)
                }
            }
            
            var objRaiz = {
                'id': data[index].id,
                'title': data[index].menu,
                'type': data[index].tipo,
                'icon':data[index].icono,
                'url':data[index].path,
                'children': arrayChildren
            }
            array.push(obj)
          }else{
             
            var obj = {
                'id': data[index].id,
                'title': data[index].menu,
                'type': data[index].tipo,
                'icon':data[index].icono,
                'url':data[index].path
            }
            array.push(obj)  
          }  
      }
      console.log(array)
      return array
  }
}
