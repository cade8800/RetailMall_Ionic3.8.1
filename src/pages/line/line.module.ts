import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinePage } from './line';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LinePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(LinePage),
  ],
  exports: [
    LinePage
  ]
})
export class LinePageModule {}
