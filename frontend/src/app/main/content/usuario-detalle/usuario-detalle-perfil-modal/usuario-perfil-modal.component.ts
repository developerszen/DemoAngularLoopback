import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PerfilesService } from '../../../services/perfiles.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.services';

@Component({
    selector     : 'fuse-usuario-perfil-modal',
    templateUrl  : './usuario-perfil-modal.component.html',
    styleUrls    : ['./usuario-perfil-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsuarioPerfilDialogComponent implements OnInit
{
    public perfiles: any;
    public formErrors: any;
    public form: FormGroup;
    public disabledSubmit = false;
    public selected: any

    constructor(public dialogRef: MatDialogRef<UsuarioPerfilDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private perfilesService: PerfilesService,
        private usuariosService: UsuariosService,
        private formBuilder: FormBuilder
    ) {
        this.formErrors = {
            perfil: {}
        };
    }

    ngOnInit() {
        this.listarPerfiles();
   
        this.form = this.formBuilder.group({
            perfil   : [this.data.fk_perfil, Validators.required]
        });
        
        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    onFormValuesChanged()
    {
        console.log("pasa por aca")
        for ( const field in this.formErrors ){
            if ( !this.formErrors.hasOwnProperty(field) ){
                continue;
            }
            this.formErrors[field] = {};
            const control = this.form.get(field);
            if ( control && control.dirty && !control.valid ){
                this.formErrors[field] = control.errors;
            }
        }
    }

    savePerfil() {
        this.disabledSubmit = true;
        let postData = {
            fk_usuario: this.data.fk_usuario,
            fk_perfil: this.form.get("perfil").value
        }
        this.usuariosService.updatePerfil(postData, resp => {
            if(resp.code != 200){
                console.log(resp.message);
            } 
            this.disabledSubmit = false;
        });
    }

    public listarPerfiles() {
        this.perfilesService.getPerfiles(resp =>{
       
            this.perfiles = resp;
        });
    }
}
