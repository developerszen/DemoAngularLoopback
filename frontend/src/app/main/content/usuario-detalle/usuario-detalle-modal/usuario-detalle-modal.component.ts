import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { UsuarioDetalleService } from '../usuario-detalle.service';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { UsuarioDetalleComponent } from '../usuario-detalle.component';

@Component({
    selector     : 'fuse-usuario-detalle-modal',
    templateUrl  : './usuario-detalle-modal.component.html',
    styleUrls    : ['./usuario-detalle-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsuarioDetalleDialogComponent implements OnInit
{
    displayedColumns = ['select', 'id', 'sistema', 'link']
    dialogTitle: string;
    dataSource
    selectedUsuarios: string[] = [];
    checkboxes: any[]
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    selection = new SelectionModel<Sistema>(true, []);

    public sistemasNoAsignados: Sistema []
    
    constructor(
        public dialogRef: MatDialogRef<UsuarioDetalleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private usuarioDetalleService: UsuarioDetalleService
    )
    {
        
    }
    ngOnInit() {
        this.listarSistemasNoAsignadosPorUsuario(this.data.fk_usuario)
        
    }

        /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    private listarSistemasNoAsignadosPorUsuario(fk_usuario){
        let data = {
            fk_usuario: fk_usuario
        }
        this.usuarioDetalleService.getSistemasNoAsignadosByUserId(data, resp => {
            console.log(resp)
            this.sistemasNoAsignados = resp;
            this.dataSource = new MatTableDataSource<Sistema>(this.sistemasNoAsignados);
        })
    }

    guardarAsignacionSistemas(){
        let array : any[] = []
        for (let index = 0; index < this.selection.selected.length; index++) {
            let obj = {
                fk_usuario: this.data.fk_usuario,
                fk_sistema: this.selection.selected[index].id
            }
            array.push(obj)
        }
        this.usuarioDetalleService.insertSistemasNoAsignados(array,function(data){
            console.log('despues de insertar')
            console.log(data)
        })
    }
}
export interface Sistema {
    id: number;
    sistema: string;
    link: string;
}