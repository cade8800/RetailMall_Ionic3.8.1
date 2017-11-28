import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { PipesModule } from '../../pipes/pipes.module';
import { CounterInputComponentModule } from '../../components/counter-input/counter-input.module';

@NgModule({
  declarations: [
    OrderPage,
  ],
  imports: [
    PipesModule,
    CounterInputComponentModule,
    IonicPageModule.forChild(OrderPage),
  ],
  exports: [
    OrderPage
  ]
})
export class OrderPageModule { }
