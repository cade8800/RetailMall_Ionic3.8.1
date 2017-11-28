import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderModifyPage } from './order-modify';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderModifyPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(OrderModifyPage),
  ],
  exports: [
    OrderModifyPage
  ]
})
export class OrderModifyPageModule {}
