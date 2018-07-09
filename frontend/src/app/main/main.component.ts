import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';

import { navigation } from 'app/navigation/navigation';
import { MainService } from './services/main.service';
import { AuthService } from './services/auth.service';

@Component({
    selector     : 'fuse-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    fuseSettings: any;
    navigation: any;

    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        private mainService: MainService,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: any
    )
    {
        this.onConfigChanged =
            this.fuseConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }
        this.navigation = navigation;
       
        // var token = localStorage.getItem('authServerToken')
        // if(token != null){
        //     var tokenStored = JSON.parse(token);
          
        //     authService.decodeToken(tokenStored.obj.token, data=>{
        //         if(data.obj!=null){
        //             mainService.getMenu(data.obj.fk_perfil, data=>{
        //                 //this.navigation = data;
        //             })
                   
        //         }
            
        //     })
          
        // }
    
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
