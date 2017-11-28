import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderService } from '../../providers/orderService';
import { LinePage } from '../line/line';
import { HotelPage } from '../hotel/hotel';
import { TicketPage } from '../ticket/ticket';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { OrderModifyPage } from '../order-modify/order-modify';
import { PaymentService } from '../../providers/paymentService';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
  providers: [OrderService, AccountService, PaymentService, LoadCtrl]
})
export class OrderDetailPage extends BasePage {

  order: any = { Invoice: {}, Shipping: {} };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loading: LoadCtrl,
    private orderService: OrderService,
    public accountService: AccountService,
    private toastCtrl: ToastCtrl,
    private alertCtrl: AlertController,
    private paymentService: PaymentService) {
    super(accountService);
    this.init();
  }

  private init() {
    let orderId = this.navParams.get('orderId');
    if (!orderId) return;
    this.loading.show();
    this.orderService.getDetail({ OrderId: orderId }).then(response => {
      if (response.Success && response.Result) {
        this.order = response.Result;
        if (!this.order.Invoice) this.order.Invoice = {};
        if (!this.order.Shipping) this.order.Shipping = {};
        this.paymentCallback();
      }
    }).catch(err => console.log(err));
  }

  goProductDetail(orderType: number, productId: string) {
    if (productId) {
      if (orderType == 2) {
        this.navCtrl.push(LinePage, { productId: productId });
      } else if (orderType == 8) {
        this.navCtrl.push(HotelPage, { productId: productId });
      } else if (orderType == 4) {
        this.navCtrl.push(TicketPage, { productId: productId });
      }
    }
  }

  private paymentCallback() {
    let formData = this.getUrlParam('formData');
    let tarOrderId = this.getUrlParam('orderid');
    if (formData && tarOrderId && tarOrderId == this.order.Id) {
      this.paymentService.paymentCallBack(formData).then(response => {
        console.log(response);
        if (response.Success) {
          this.order.PaymentState = 1;
          this.loading.hide();
        }
      }).catch(err => console.log(err));
    } else this.loading.hide();
  }

  backProductDetail() {
    let source = this.navParams.get("source");
    let viewList = this.navCtrl.getViews();
    if (source && source == "ordersubmit") {
      let tagetView = viewList.filter(function (item) {
        return item.name == "TicketPage" || item.name == "LinePage" || item.name == "HotelPage"
      });
      this.navCtrl.popTo(tagetView[tagetView.length - 1]);
    } else if (source && source == "orderlist") {
      let tagetView = viewList.filter(function (item) {
        return item.name == "OrderListPage"
      });
      this.navCtrl.popTo(tagetView[tagetView.length - 1]);
    } else {
      this.navCtrl.pop();
    }
  }

  cancelBtnClick() {
    if (this.order.OrderState == 5) return;
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: '确定要取消这个订单吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => this.cancelOrder()
        }
      ]
    });
    confirm.present();
  }

  private cancelOrder() {
    this.loading.show();
    this.orderService.cancelOrder(this.order.Id).then(response => {
      // console.log(response);
      if (response.Success) {
        this.loading.hide();
        this.toastCtrl.show('订单已取消');
        this.order.OrderState = 5;
      }
    }).catch(err => console.log(err));
  }

  orderModify() {
    this.navCtrl.push(OrderModifyPage, { order: this.order });
  }

  orderPayment() {
    if (this.order.PaymentState) return;
    this.loading.show();
    this.paymentService.paymentConfirm(this.order.Id).then(response => {
      // console.log(response);
      if (response.Success) {
        this.loading.hide();
        if (response.Result) {
          window.location.href = response.Result;
        }
      }
    }).catch(err => console.log(err));
  }

}
