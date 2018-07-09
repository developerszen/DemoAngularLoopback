import { Component, OnInit, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { HomeService } from '../../services/home.services';
import { TokenHelper } from '../../helpers/token-helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: fuseAnimations
})
export class HomeComponent implements OnInit {

  length;
  sistemas: any[];
  filteredSistemas: any[];
  searchTerm = '';

  constructor(private homeService: HomeService) { }

  ngOnInit() {
     this.homeService.getSistemas().then(sistemas=>{
      this.sistemas = this.filteredSistemas = sistemas;
      length = sistemas.length;
     })
  }
  /**
   * convertTimeAgo
   * *Convierte la fecha en el tiempo que pasó
   * @param fecha 
   */
  convertTimeAgo(fecha){
    moment.locale('es')
    return moment(fecha).fromNow()
  }
  /**
   * filterSistemasByTerm
   * * Filtra el array sistemas por el parametro de busqueda
   */
  filterSistemasByTerm() {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm === '') {
      this.filteredSistemas = this.sistemas;
    } else {
      this.filteredSistemas = this.sistemas.filter((sistema) => {
        return sistema.sistema.toLowerCase().includes(searchTerm)
      });
    }
  }
  /**
   * redirectLink 
   * * Redirecciona 
   * @param fecha 
   */
  redirectLink(link){
    let token = TokenHelper.getToken()
    if(token != null){
        window.location.href = link+"?access_token=" + token
    }    
  }
}
