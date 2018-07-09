import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { SistemasService } from '../../services/sistemas.service';
import { Sistema } from '../../models/sistema.model';
import { Paginacion } from '../../models/paginacion.model';

@Component({
    selector: 'app-sistemas',
    templateUrl: './sistemas.component.html',
    styleUrls: ['./sistemas.component.scss'],
    animations: fuseAnimations
})
export class SistemasComponent implements OnInit {

    public paginacion: Paginacion;
    public sistemas: Sistema[]
    public dataSource
    filterValue = ''
    sistema: any;
    onFormChange: any;
    form: FormGroup;

    displayedColumns = ['id', 'sistema', 'link', 'color'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private sistemasService: SistemasService) {
        this.paginacion = new Paginacion();
        this.form = new FormGroup({
            search: new FormControl(''),
        });
    }

    ngOnInit() {
        this.onFormChange = this.form.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(data => {
            this.applyFilter(data.search)
        });

        this.listarSistemas(this.filterValue, 0, this.paginacion.pageSize,true);
    

    }
    /**
     * listarSistemas
     * * Lista los sistemas paginando en base a parametros
     */
    public listarSistemas(filter, skip, limit,init) {
        var parametros = {
            filtro: filter,
            skip: skip,
            limit: this.paginacion.pageSize,
            fk_sistema: ''
        }
        
        this.sistemasService.getSistemas(parametros, resp => {
            this.sistemas = resp.data;
            this.dataSource = new MatTableDataSource<Sistema>(this.sistemas)
            if(init)
            this.dataSource.paginator = this.paginator
            this.paginacion.length = resp.count
        })
    }

    applyFilter(filterValue: string) {
        this.filterValue = filterValue.trim().toLowerCase();
        this.listarSistemas(this.filterValue, 0, this.paginacion.pageSize,false)
    }

    onPaginateChange(event) {
        this.listarSistemas(this.filterValue, 
            event.pageIndex * this.paginacion.pageSize, this.paginacion.pageSize,false)
    }
}

