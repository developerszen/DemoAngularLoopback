import { Inject, Injectable, InjectionToken } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject } from 'rxjs';

import * as _ from 'lodash';

// Create the injection token for the custom config
export const FUSE_CONFIG = new InjectionToken('fuseCustomConfig');

@Injectable()
export class FuseConfigService
{
    config: any;
    defaultConfig: any;
    isSetConfigRan = false;

    onConfigChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param router
     * @param platform
     * @param config
     */
    constructor(
        private router: Router,
        public platform: Platform,
        @Inject(FUSE_CONFIG) config
    )
    {
        // Set the default config from the user provided one (forRoot)
        this.defaultConfig = config;

        /**
         * Disable Custom Scrollbars if Browser is Mobile
         */
        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.defaultConfig.customScrollbars = false;
        }

        // Set the config from the default config
        this.config = _.cloneDeep(this.defaultConfig);

        // Reload the default settings for the
        // layout on every navigation start
        router.events.subscribe(
            (event) => {

                if ( event instanceof NavigationStart )
                {
                    this.isSetConfigRan = false;
                }

                if ( event instanceof NavigationEnd )
                {
                    if ( this.isSetConfigRan )
                    {
                        return;
                    }

                    this.setConfig({
                            layout: this.defaultConfig.layout
                        }
                    );
                }
            }
        );

        // Create the behavior subject
        this.onConfigChanged = new BehaviorSubject(this.config);
    }

    /**
     * Set the new config from given object
     *
     * @param config
     */
    setConfig(config): void
    {
        // Set the SetConfigRan true
        this.isSetConfigRan = true;

        // Merge the config
        this.config = _.merge({}, this.config, config);

        // Trigger the event
        this.onConfigChanged.next(this.config);
    }
}

