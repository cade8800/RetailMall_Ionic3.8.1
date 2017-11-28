import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ShippingService } from '../../providers/shippingService';
import { OrderPage } from '../order/order';
import { ShippingEditPage } from '../shipping-edit/shipping-edit';
import { OrderModifyPage } from '../order-modify/order-modify';
import { LoadCtrl } from '../../providers/loadingController';

@IonicPage()
@Component({
  selector: 'page-shipping',
  templateUrl: 'shipping.html',
  providers: [ShippingService, LoadCtrl]
})
export class ShippingPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private shippingService: ShippingService,
    private loading: LoadCtrl,
    private alertCtrl: AlertController) {
    this.init();
  }

  input: any = {};
  order: any = {};
  shippingList: any = [];

  private init() {
    this.input = this.navParams.get('input');
    this.order = this.navParams.get('order');
    this.loading.show();
    this.shippingService.get().then(response => {
      if (response.Success) {
        this.shippingList = response.Result;
        this.loading.hide();
      }
    }).catch(err => console.log(err));
  }

  choiceShipping(shipping: any) {
    if (!shipping) return;
    if (this.input) {
      this.input.RetailMallOrderInfoInput.Shipping = shipping;
      this.input.RetailMallOrderInfoInput.Shipping.IsActive = true;
      this.navCtrl.push(OrderPage, { input: this.input });
    } else if (this.order) {
      this.order.Shipping = shipping;
      this.order.Shipping.IsActive = true;
      this.navCtrl.push(OrderModifyPage, { order: this.order });
    }
  }

  addShipping() {
    this.navCtrl.push(ShippingEditPage, { input: this.input, order: this.order });
  }

  editShipping(item: any) {
    console.log(item);
    if (!item) return;
    this.navCtrl.push(ShippingEditPage, { input: this.input, shipping: item, order: this.order });
  }

  deleteShipping(shipping: any) {
    console.log(shipping);
    if (!shipping || !shipping.Id) return;
    let confirm = this.alertCtrl.create({
      title: '删除提示',
      message: '确定要删除当前邮寄地址吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.loading.show();
            this.shippingService.delete(shipping.Id).then(response => {
              if (response.Success) {
                this.loading.hide();
                this.shippingList.splice(this.shippingList.indexOf(shipping), 1);
              }
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    confirm.present();
  }

}
