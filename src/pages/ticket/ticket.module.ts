import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketPage } from './ticket';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TicketPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TicketPage),
  ],
  exports: [
    TicketPage
  ]
})
export class TicketPageModule {}
