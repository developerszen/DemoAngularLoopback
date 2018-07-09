import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Router } from '@angular/router';
import { TokenHelper } from './main/helpers/token-helper';
import { AuthService } from './main/services/auth.service';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    constructor(
        private translate: TranslateService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private fuseTranslationLoader: FuseTranslationLoaderService,
        private authService: AuthService,
        private router: Router
    )
    {
    }

    ngOnInit() {
        let token = TokenHelper.getToken()
        if(token != null) {
            this.authService.isLoggedIn(token, resp => {
                if(resp.code != 200){
                    localStorage.removeItem('authServerToken');
                    this.router.navigateByUrl('/login');
                }else if (resp.code == 200){
                    //this.router.navigateByUrl('/home')
                }
            });
        }else{
            this.router.navigateByUrl('/login');
        }
    }
}
