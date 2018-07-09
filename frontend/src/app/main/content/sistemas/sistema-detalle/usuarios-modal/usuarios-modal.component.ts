import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Usuario } from '../../../../models/usuario.model';
import { UsuariosService } from '../../../../services/usuarios.services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { UsuarioSistemaService } from '../../../../services/usuariosistema.service';

@Component({
    selector     : 'fuse-usuarios-modal',
    templateUrl  : './usuarios-modal.component.html',
    styleUrls    : ['./usuarios-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsuariosDialogComponent implements OnInit
{
    displayedColumns = ['select','id', 'username', 'nombres', 'apellidos'];

    public usuarios: Usuario[]
    public dataSource
    length;
    pageSize = 10;
    filterValue = ''
    user: any;
    onFormChange: any;
    userForm: FormGroup;
    selection = new SelectionModel<Sistema>(true, []);
    
    public sistemasNoAsignados: Sistema []
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        public dialogRef: MatDialogRef<UsuariosDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private usuarioSistemaService: UsuarioSistemaService
    )
    {
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

        this.listarUsuarios();
    
    }

    public onChangeMaster(event) {
        this.masterToggle()
    }

    public onChange(event, row) {
        this.selection.toggle(row)
    }


    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    /**
     * listarUsuarios
     * * Lista los usuarios que no tengan el sistema asignadopaginando en base a parametros  
     */
    public listarUsuarios() {
        var parametros = {
            fk_sistema: this.data.fk_sistema
        }
        this.usuarioSistemaService.getUsuariosNotInSistema(parametros, resp=>{
            this.usuarios = resp;
            this.dataSource = new MatTableDataSource<Usuario>(this.usuarios)
            this.dataSource. paginator = this.paginator
            this.length = resp.count
        });
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
    guardarAsignacionUsuarios(){
        let array : any[] = []
        for (let index = 0; index < this.selection.selected.length; index++) {
            let obj = {
                fk_usuario: this.selection.selected[index].id,
                fk_sistema: this.data.fk_sistema
            }
            array.push(obj)
        }
        this.usuarioSistemaService.insertUsuariosNoAsignados(array,function(data){
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