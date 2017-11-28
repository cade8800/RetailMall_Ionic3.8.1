import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastCtrl {

    private toast: any;

    constructor(private toastCtrl: ToastController) { }

    public show(msg: string) {
        if (!msg) return;
        this.toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top',
            dismissOnPageChange: true,
            showCloseButton: true
        });
        this.toast.present();
    }

}