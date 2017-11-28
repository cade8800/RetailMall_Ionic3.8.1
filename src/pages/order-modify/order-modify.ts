import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VisitorPage } from '../visitor/visitor';
import { InvoicePage } from '../invoice/invoice';
import { ShippingPage } from '../shipping/shipping';
import { OrderService } from '../../providers/orderService';
import { OrderDetailPage } from '../order-detail/order-detail';
import { LoadCtrl } from '../../providers/loadingController';

@IonicPage()
@Component({
  selector: 'page-order-modify',
  templateUrl: 'order-modify.html',
  providers: [OrderService, LoadCtrl]
})
export class OrderModifyPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loading: LoadCtrl,
    private orderService: OrderService) {
    this.init();
  }

  order: any = { Invoice: { IsActive: false }, Shipping: { IsActive: false } };

  private init() {
    this.order = this.navParams.get("order");
  }


  goVisitorPage() {
    this.navCtrl.push(VisitorPage, { order: this.order });
  }

  goInvoice() {
    this.navCtrl.push(InvoicePage, { order: this.order });
  }

  goShipping() {
    this.navCtrl.push(ShippingPage, { order: this.order });
  }

  saveOrder() {

    this.loading.showDialog();
    this.orderService.updateOrderInfo(this.order).then(response => {
      console.log(response);
      if (response.Success) {
        this.loading.hide();
        this.navCtrl.push(OrderDetailPage, { orderId: this.order.Id, source: 'ordermodify' });
      }
    }).catch(err => console.log(err));

  }
}
