import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { UsuarioDetalleService } from './usuario-detalle.service';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { UsuarioDetalleDialogComponent } from './usuario-detalle-modal/usuario-detalle-modal.component';
import { MatDialog, MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { UsuarioTokenDialogComponent } from './usuario-tokens/usuario-tokens.component';
import { UsuarioPerfilDialogComponent } from './usuario-detalle-perfil-modal/usuario-perfil-modal.component';
import { UsuariosService } from '../../services/usuarios.services';

@Component({
    selector: 'fuse-usuario-detalle',
    templateUrl: './usuario-detalle.component.html',
    styleUrls: ['./usuario-detalle.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UsuarioDetalleComponent implements OnInit {
    public sistemas: Sistema[]
    public displayedColumns = ['select', 'id', 'sistema', 'link'];
    public dataSource
    public dialogRef
    public selection = new SelectionModel<Sistema>(true, []);
    public enableDelete: boolean;
    public nombres: string;
    public foto: string;
    public fk_perfil: number;
    public perfil: string;

    @ViewChild(MatSort) sort: MatSort

    constructor(
        private usuarioDetalleService: UsuarioDetalleService,
        private usuariosService: UsuariosService,
        private route: ActivatedRoute,
        public dialog: MatDialog) {
        this.enableDelete = false;
        
        this.cargarCabecera();
       
    }

    private cargarCabecera() {
        let data = {
            filtro: null,
            skip: null,
            limit: null,
            fk_usuario: this.route.snapshot.paramMap.get('id')
        }
        this.usuariosService.getUsuarios(data, resp =>{
            this.nombres = resp.data[0].nombres + " " + resp.data[0].apellidos;
            this.foto = resp.data[0].foto;
            this.fk_perfil = resp.data[0].fk_perfil;
            this.perfil = resp.data[0].perfil;
        });
    }

    ngOnInit() {
        this.listarSistemasPorUsuario()
    }

    /**
     * updateUrl
     */
    public updateUrl(event) {
        this.foto = "assets/images/avatars/profile.jpg"
    }

    public onChangeMaster(event) {
        this.masterToggle()
        this.enableDelete = this.selection.selected.length > 0
    }

    public onChange(event, row) {
        this.selection.toggle(row)
        this.enableDelete = this.selection.selected.length > 0
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    public listarSistemasPorUsuario() {
        let data = {
            fk_usuario: this.route.snapshot.paramMap.get('id')
        }
        this.usuarioDetalleService.getSistemasByUserId(data, resp => {
            this.sistemas = resp;
            this.dataSource = new MatTableDataSource<Sistema>(this.sistemas);
            this.dataSource.sort = this.sort
        })
    }

    public verTokens() {
        this.dialogRef = this.dialog.open(UsuarioTokenDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: { fk_usuario: this.route.snapshot.paramMap.get('id') }
        })
    }

    public asignarSistemas() {
        this.dialogRef = this.dialog.open(UsuarioDetalleDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: { fk_usuario: this.route.snapshot.paramMap.get('id') }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    this.listarSistemasPorUsuario()
                    return;
                }
            });
    }

    public setPerfil() {
        this.dialogRef = this.dialog.open(UsuarioPerfilDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: { fk_usuario: this.route.snapshot.paramMap.get('id'), fk_perfil: this.fk_perfil }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    this.cargarCabecera();
                    return;
                }
            });
    }

    public eliminarSistemasAsignados() {
        let array: any[] = []
        for (let index = 0; index < this.selection.selected.length; index++) {
            let obj = {
                fk_usuario: this.route.snapshot.paramMap.get('id'),
                fk_sistema: this.selection.selected[index].id
            }
            array.push(obj)
        }
        this.usuarioDetalleService.deleteUsuariosSistemas(array, data => {
            this.listarSistemasPorUsuario()
            this.enableDelete = false
        })
    }


}
export interface Sistema {
    id: number;
    sistema: string;
    link: string;
}
