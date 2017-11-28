import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceEditPage } from './invoice-edit';

@NgModule({
  declarations: [
    InvoiceEditPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceEditPage),
  ],
  exports: [
    InvoiceEditPage
  ]
})
export class InvoiceEditPageModule {}
