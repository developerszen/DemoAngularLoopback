import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseNavigationModule, FuseSearchBarModule, FuseShortcutsModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { FuseContentModule } from 'app/main/content/content.module';
import { FuseFooterModule } from 'app/main/footer/footer.module';
import { FuseNavbarModule } from 'app/main/navbar/navbar.module';
import { FuseQuickPanelModule } from 'app/main/quick-panel/quick-panel.module';
import { FuseToolbarModule } from 'app/main/toolbar/toolbar.module';

import { FuseMainComponent } from './main.component';
import { MainService } from './services/main.service';
import { TokensService } from './services/tokens.service';
import { HomeService } from './services/home.services';
import { UsuariosService } from './services/usuarios.services';
import { UsuarioDetalleService } from './content/usuario-detalle/usuario-detalle.service';
import { PerfilesService } from './services/perfiles.service';
import { SistemasService } from './services/sistemas.service';
import { UsuarioSistemaService } from './services/usuariosistema.service';


@NgModule({
    declarations: [
        FuseMainComponent,
    ],
    imports     : [
        RouterModule,

        MatSidenavModule,

        FuseSharedModule,

        FuseThemeOptionsModule,
        FuseNavigationModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        FuseSidebarModule,

        FuseContentModule,
        FuseFooterModule,
        FuseNavbarModule,
        FuseQuickPanelModule,
        FuseToolbarModule,
    ],
    exports     : [
        FuseMainComponent
    ],
    providers: [
       MainService, 
       TokensService,        
       HomeService, 
       UsuariosService,
       UsuarioDetalleService,
       PerfilesService,
       SistemasService,
       UsuarioSistemaService
    ],
})
export class FuseMainModule
{
}
