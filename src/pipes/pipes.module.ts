import { NgModule } from '@angular/core';
import { PaymentStatePipe } from './payment-state/payment-state';
import { TextOverflowEllipsisPipe } from './text-overflow-ellipsis/text-overflow-ellipsis';
import { ToFixedPipe } from './to-fixed/to-fixed';
import { VisitorTypePipe } from './visitor-type/visitor-type';

@NgModule({
    declarations: [PaymentStatePipe,
        TextOverflowEllipsisPipe,
        ToFixedPipe,
        VisitorTypePipe],
    imports: [],
    exports: [PaymentStatePipe,
        TextOverflowEllipsisPipe,
        ToFixedPipe,
        VisitorTypePipe]
})
export class PipesModule { }
