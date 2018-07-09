import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseContentComponent } from 'app/main/content/content.component';
import { ParametrosComponent } from 'app/main/content/parametros/parametros.component'
import { LoginComponent } from './authentication/login/login.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatChipsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatToolbarModule, MatHeaderRow, MatProgressSpinnerModule, MatProgressBar, MatProgressBarModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { UsuarioDetalleDialogComponent } from './usuario-detalle/usuario-detalle-modal/usuario-detalle-modal.component';
import { UsuarioTokenDialogComponent } from './usuario-detalle/usuario-tokens/usuario-tokens.component';
import { UsuarioPerfilDialogComponent } from './usuario-detalle/usuario-detalle-perfil-modal/usuario-perfil-modal.component';
import { SistemasComponent } from './sistemas/sistemas.component';
import { SistemaDetalleComponent } from './sistemas/sistema-detalle/sistema-detalle.component';
import { UsuariosDialogComponent } from './sistemas/sistema-detalle/usuarios-modal/usuarios-modal.component';


const routes: Routes = [
    {
        path      : 'login',
        component: LoginComponent
    },
    {
        path      : 'parametros',
        component: ParametrosComponent
    },
    {
        path      : 'home',
        component: HomeComponent
    },
    {
        path      : 'usuarios',
        component: UsuariosComponent
    },
    {
        path     : 'usuarios/:id',
        component: UsuarioDetalleComponent
    },
    {
        path      : 'sistemas',
        component: SistemasComponent
    },
    {
        path     : 'sistemas/:id',
        component: SistemaDetalleComponent
    }
];

@NgModule({
    declarations: [
        FuseContentComponent,
        ParametrosComponent,
        LoginComponent,
        HomeComponent,
        UsuariosComponent,
        UsuarioDetalleComponent,
        UsuarioDetalleDialogComponent,
        UsuarioTokenDialogComponent,
        UsuarioPerfilDialogComponent,
        SistemasComponent,
        SistemaDetalleComponent,
        UsuariosDialogComponent
    ],
    imports     : [
        RouterModule.forRoot(routes),
        FuseSharedModule,

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatIconModule,
        MatTabsModule,
        MatChipsModule,
        MatTableModule,
        MatPaginatorModule,
        CdkTableModule,
        MatSortModule,
        ChartsModule,
        NgxChartsModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        FuseSharedModule
    ],
    exports: [
        FuseContentComponent
    ],
    entryComponents: [
        UsuarioDetalleDialogComponent,
        UsuarioTokenDialogComponent,
        UsuarioPerfilDialogComponent,
        UsuariosDialogComponent
    ]
})
export class FuseContentModule
{
}
