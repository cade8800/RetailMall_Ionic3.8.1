import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CounterInputComponent } from './counter-input';

@NgModule({
  declarations: [
    CounterInputComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CounterInputComponent
  ]
})
export class CounterInputComponentModule {}
