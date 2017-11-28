import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadCtrl {
    private loader: any;
    constructor(private loadCtrl: LoadingController) { }

    public show() {
        this.loader = this.loadCtrl.create({
            duration: 8000,
            // dismissOnPageChange: true,
            showBackdrop: false,
            cssClass: 'public-loading'
        });
        this.loader.present();
    }

    public showDialog() {
        this.loader = this.loadCtrl.create({
            // duration: 15000,
            // dismissOnPageChange: true
        });
        this.loader.present();
    }

    public hide() {
        if (this.loader)
            this.loader.dismiss();
    }

    public showShareLoading() {
        this.loader = this.loadCtrl.create({
            duration: 1000,
            // dismissOnPageChange: true,
            showBackdrop: false
        });
        this.loader.present();
    }

}