import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShippingPage } from './shipping';

@NgModule({
  declarations: [
    ShippingPage,
  ],
  imports: [
    IonicPageModule.forChild(ShippingPage),
  ],
  exports: [
    ShippingPage
  ]
})
export class ShippingPageModule {}
