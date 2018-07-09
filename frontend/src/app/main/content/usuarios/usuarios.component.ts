import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { UsuariosService } from '../../services/usuarios.services';
import { Usuario } from '../../models/usuario.model';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss'],
    animations: fuseAnimations
})
export class UsuariosComponent implements OnInit {

    public usuarios: Usuario[];
    public dataSource;
    length;
    pageSize = 10;
    filterValue = '';
    user: any;
    onFormChange: any;
    userForm: FormGroup;

    displayedColumns = ['id', 'username', 'nombres', 'apellidos', 'logins','last_login'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private usuariosService: UsuariosService) {
        this.userForm = new FormGroup({
            search: new FormControl(''),
        });
    }

    ngOnInit() {
        this.onFormChange = this.userForm.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(data => {
            this.applyFilter(data.search)
        });

        this.listarUsuarios(this.filterValue, 0, this.pageSize,true);
    

    }
    /**
     * listarUsuarios
     * * Lista los usuarios paginando en base a parametros-  
     */
    public listarUsuarios(filter, skip, limit,init) {
        var parametros = {
            filtro: filter,
            skip: skip,
            limit: this.pageSize,
            fk_usuario: ''
        }
        
        this.usuariosService.getUsuarios(parametros, resp=>{
            console.log(resp)
            this.usuarios = resp.data;
            this.dataSource = new MatTableDataSource<Usuario>(this.usuarios)
            if(init)
            this.dataSource. paginator = this.paginator
            this.length = resp.count
        })
    }

    applyFilter(filterValue: string) {
        this.filterValue = filterValue.trim().toLowerCase();
        this.listarUsuarios(this.filterValue, 0, this.pageSize,false)
    }

    onPaginateChange(event) {
        this.listarUsuarios(this.filterValue, 
            event.pageIndex * this.pageSize, this.pageSize,false)
    }

    formatDate(fecha){
        if(fecha!= null && fecha != '')
           return moment(fecha).format('DD/MM/YYYY h:mm:ss')
        else 
           return 'SIN DATOS'    
    }
}

