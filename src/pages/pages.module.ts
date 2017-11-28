import { NgModule } from '@angular/core';

import { AccountPageModule } from './account/account.module';
import { HomePageModule } from './home/home.module';
import { HotelPageModule } from './hotel/hotel.module';
import { InvoicePageModule } from './invoice/invoice.module';
import { InvoiceEditPageModule } from './invoice-edit/invoice-edit.module';
import { LinePageModule } from './line/line.module';
import { OrderPageModule } from './order/order.module';
import { OrderDetailPageModule } from './order-detail/order-detail.module';
import { OrderListPageModule } from './order-list/order-list.module';
import { OrderModifyPageModule } from './order-modify/order-modify.module';
import { SearchPageModule } from './search/search.module';
import { ShippingPageModule } from './shipping/shipping.module';
import { ShippingEditPageModule } from './shipping-edit/shipping-edit.module';
import { TicketPageModule } from './ticket/ticket.module';
import { VisitorPageModule } from './visitor/visitor.module';
import { VisitorEditPageModule } from './visitor-edit/visitor-edit.module';

@NgModule({
    imports: [
        AccountPageModule,
        HomePageModule,
        HotelPageModule,
        InvoicePageModule,
        InvoiceEditPageModule,
        LinePageModule,
        OrderPageModule,
        OrderDetailPageModule,
        OrderListPageModule,
        OrderModifyPageModule,
        SearchPageModule,
        ShippingPageModule,
        ShippingEditPageModule,
        TicketPageModule,
        VisitorPageModule,
        VisitorEditPageModule
    ],
    declarations: [],
    providers: [],
    exports: []
})
export class PagesModule { }