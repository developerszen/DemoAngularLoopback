import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { Subscription } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector   : 'fuse-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls  : ['./theme-options.component.scss'],
    animations : fuseAnimations
})
export class FuseThemeOptionsComponent implements OnInit, OnDestroy
{
    @Input() navigation;
    @ViewChild('openButton') openButton;
    @ViewChild('panel') panel;
    @ViewChild('overlay') overlay: ElementRef;

    public player: AnimationPlayer;
    config: any;

    onConfigChanged: Subscription;

    @HostBinding('class.bar-closed') barClosed: boolean;

    constructor(
        private animationBuilder: AnimationBuilder,
        private fuseConfig: FuseConfigService,
        private navigationService: FuseNavigationService,
        private renderer: Renderer2
    )
    {
        this.barClosed = true;

        this.onConfigChanged =
            this.fuseConfig.onConfigChanged
                .subscribe(
                    (newConfig) => {
                        this.config = newConfig;
                    }
                );
    }

    ngOnInit()
    {
        this.renderer.listen(this.overlay.nativeElement, 'click', () => {
            this.closeBar();
        });

        // Get the nav model and add customize nav item
        // that opens the bar programmatically
        const nav: any = this.navigation;

        // nav.push({
        //     'id'      : 'custom-function',
        //     'title'   : 'Custom Function',
        //     'type'    : 'group',
        //     'children': [
        //         {
        //             'id'      : 'customize',
        //             'title'   : 'Customize',
        //             'type'    : 'item',
        //             'icon'    : 'settings',
        //             'function': () => {
        //                 this.openBar();
        //             }
        //         }
        //     ]
        // });
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }

    onSettingsChange()
    {
        this.fuseConfig.setConfig(this.config);
    }

    closeBar()
    {
        this.player =
            this.animationBuilder
                .build([
                    style({transform: 'translate3d(0,0,0)'}),
                    animate('400ms ease', style({transform: 'translate3d(100%,0,0)'}))
                ]).create(this.panel.nativeElement);

        this.player.play();

        this.player.onDone(() => {
            this.barClosed = true;
        });
    }

    openBar()
    {
        this.barClosed = false;

        this.player =
            this.animationBuilder
                .build([
                    style({transform: 'translate3d(100%,0,0)'}),
                    animate('400ms ease', style({transform: 'translate3d(0,0,0)'}))
                ]).create(this.panel.nativeElement);

        this.player.play();
    }
}
