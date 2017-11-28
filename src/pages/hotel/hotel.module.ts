import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelPage } from './hotel';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HotelPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(HotelPage),
  ],
  exports: [
    HotelPage
  ]
})
export class HotelPageModule { }
