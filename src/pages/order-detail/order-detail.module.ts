import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailPage } from './order-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(OrderDetailPage),
  ],
  exports: [
    OrderDetailPage
  ]
})
export class OrderDetailPageModule {}
