import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { TokensService } from '../../../services/tokens.service';
import { Token } from '../../../models/Token.model';
import * as moment from 'moment';
import { TokenHelper } from '../../../helpers/token-helper';

@Component({
    selector     : 'fuse-usuario-tokens',
    templateUrl  : './usuario-tokens.component.html',
    styleUrls    : ['./usuario-tokens.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsuarioTokenDialogComponent implements OnInit
{
    public tokens: Token[]
   
    dialogTitle: string;
    dataSource;
    isInit: boolean = true;
    limit = 10;
    skip = 0;
    length;
    tokenActual = TokenHelper.getToken();

    displayedColumns = ['id', 'fechacreacion','habilitado','ip', 'buttons']
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        public dialogRef: MatDialogRef<UsuarioTokenDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokensService: TokensService
    )
    {
        
    }
    ngOnInit() {
        this.listarTokensUsuario()
        
    }
    /**
     * listarTokensUsuario
     * * Lista los tokens habilitados de un usuario
     */
    private listarTokensUsuario(){
        let data = {
                fk_usuario: this.data.fk_usuario,
                habilitado: true,
                limit: this.limit,
                skip: this.skip            
        }
        this.tokensService.getTokens(data, resp=>{
            this.tokens = resp;
            this.dataSource = new MatTableDataSource<Token>(this.tokens);
            if(this.isInit) this.dataSource.paginator = this.paginator
            this.length = resp.count
        });
    }

    formatDate(fecha){
        if(fecha!= null && fecha != '')
           return moment(fecha).format('DD/MM/YYYY h:mm:ss')
        else 
           return 'SIN DATOS'    
    }

    cerrarSesion(fk_token) {
        console.log(fk_token)
        let postData = {
            fk_token: fk_token
        }
        this.tokensService.deshabilitarToken(postData, data => {
            console.log(data)
            this.listarTokensUsuario();
        })    
    }

    onPaginateChange(event) {
        this.listarTokensUsuario();
    }
}