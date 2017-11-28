import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderListPage } from './order-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderListPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(OrderListPage),
  ],
  exports: [
    OrderListPage
  ]
})
export class OrderListPageModule {}
