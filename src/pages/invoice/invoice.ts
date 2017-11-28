import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { InvoiceService } from '../../providers/invoiceService';
import { OrderPage } from '../order/order';
import { InvoiceEditPage } from '../invoice-edit/invoice-edit';
import { OrderModifyPage } from '../order-modify/order-modify';
import { LoadCtrl } from '../../providers/loadingController';

@IonicPage()
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
  providers: [InvoiceService, LoadCtrl]
})
export class InvoicePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private invoiceService: InvoiceService,
    private loading: LoadCtrl,
    private alertCtrl: AlertController) {
    this.init();
  }

  invoiceList: any = [];
  input: any = {};
  order: any = {};

  private init() {
    this.input = this.navParams.get('input');
    this.order = this.navParams.get('order');
    this.loading.show();
    this.invoiceService.get().then(response => {
      if (response.Success) {
        this.loading.hide();
        this.invoiceList = response.Result;
      }
    }).catch(err => console.log(err));
  }

  choice(item: any) {
    if (!item) return;
    if (this.input) {
      this.input.RetailMallOrderInfoInput.Invoice = item;
      this.input.RetailMallOrderInfoInput.Invoice.IsActive = true;
      this.navCtrl.push(OrderPage, { input: this.input });
    } else if (this.order) {
      this.order.Invoice = item;
      this.order.Invoice.IsActive = true;
      this.navCtrl.push(OrderModifyPage, { order: this.order });
    }
  }

  edit(item: any) {
    if (!item) return;
    this.navCtrl.push(InvoiceEditPage, { input: this.input, invoice: item, order: this.order });
  }

  delete(item: any) {
    console.log(item);
    if (!item || !item.Id) return;
    let confirm = this.alertCtrl.create({
      title: '删除提示',
      message: '确定要删除当前发票信息吗？',
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
            this.invoiceService.delete(item.Id).then(response => {
              if (response.Success) {
                this.loading.hide();
                this.invoiceList.splice(this.invoiceList.indexOf(item), 1);
              }
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    confirm.present();
  }

  add() {
    this.navCtrl.push(InvoiceEditPage, { input: this.input, order: this.order });
  }

}
