import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VisitorPage } from '../visitor/visitor';
import { OrderService } from '../../providers/orderService';
import { AccountService } from '../../providers/accountService';
import { OrderDetailPage } from '../order-detail/order-detail';
import { BasePage } from '../../providers/basePage';
import { InvoicePage } from '../invoice/invoice';
import { ShippingPage } from '../shipping/shipping';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';
import { InvoiceService } from '../../providers/invoiceService';
import { ShippingService } from '../../providers/shippingService';
import { AgencyService } from '../../providers/agencyService';
import { PaymentService } from '../../providers/paymentService';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers: [OrderService, AccountService, LoadCtrl, InvoiceService, ShippingService, PaymentService]
})
export class OrderPage extends BasePage {

  input: any = {};
  hotelInput = {};
  total: number = 0;
  isShowContactDetail: boolean = false;
  private retailOrderId: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private orderService: OrderService,
    private toastCtrl: ToastCtrl,
    private loading: LoadCtrl,
    public accountService: AccountService,
    private invoiceService: InvoiceService,
    private shippingService: ShippingService,
    private paymentService: PaymentService) {
    super(accountService);
    this.input = this.navParams.get('input');
    this.getCurrentContact();
    this.getTotal();
  }

  backProductDetail() {
    let viewList = this.navCtrl.getViews();
    let tagetView = viewList.filter(function (item) {
      return item.name == "TicketPage" || item.name == "LinePage" || item.name == "HotelPage"
    });
    this.navCtrl.popTo(tagetView[tagetView.length - 1]);
  }

  private getCurrentContact() {
    if (!this.input.RetailMallOrderInfoInput.ContactName || !this.input.RetailMallOrderInfoInput.ContactPhone) {
      this.accountService.getContact().then(res => {
        if (res.Success) {
          let currentContact = res.Result;
          this.input.RetailMallOrderInfoInput.ContactEmail = currentContact.Email;
          this.input.RetailMallOrderInfoInput.ContactName = currentContact.Name;
          this.input.RetailMallOrderInfoInput.ContactPhone = currentContact.PhoneNumber;
        }
      }).catch();
    }
  }

  goVisitorPage() {
    this.navCtrl.push(VisitorPage, { input: this.input });
  }

  getTotal() {
    this.total = 0;
    this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.forEach(element => {
      this.total += element.Quantity * element.price;
    });
    if (this.input.RetailMallOrderInfoInput.OrderType == 8) {
      this.total = this.total * this.input.bookTimeInfo.dateDiff;
    }
  }

  submitOrder() {
    if (!this.total) {
      this.toastCtrl.show("请选择预订数量");
      return;
    }
    if (!this.input.RetailMallOrderInfoInput.ContactName || !this.input.RetailMallOrderInfoInput.ContactPhone) {
      this.toastCtrl.show("请完善联系人信息");
      return;
    }
    if (this.input.OrderVisitorListInput.length < 1) {
      this.toastCtrl.show("请选择添加游客");
      return;
    }
    if (this.remainingSeatsCheck(this.input)) {
      this.toastCtrl.show("预定数量超出余量，请重新填写");
      return;
    }
    if (this.input.RetailMallOrderInfoInput.Invoice.IsActive && !this.input.RetailMallOrderInfoInput.Invoice.Title) {
      this.toastCtrl.show('请填写发票信息');
      return;
    }
    if (this.input.RetailMallOrderInfoInput.Shipping.IsActive && !this.input.RetailMallOrderInfoInput.Shipping.ReceiverName) {
      this.toastCtrl.show('请填写邮寄地址');
      return;
    }


    if (this.input.RetailMallOrderInfoInput.OrderType == 8) {
      this.submit(this.setHotelInputQuoteList(JSON.parse(JSON.stringify(this.input))));
    } else {
      this.submit(this.checkInput(JSON.parse(JSON.stringify(this.input))));
    }
  }

  /**
   * 过滤掉预订数量为0的报价项
   * @param input 
   */
  private checkInput(input: any) {
    input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput =
      input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.filter(function (item) {
        return item.Quantity
      });
    return input;
  }

  private submit(input: any) {
    this.loading.showDialog();
    this.orderService.submitOrder(input).then(response => {
      // this.loading.hide();
      if (response.Success && response.Result) {
        // this.toastCtrl.show("订单已成功提交");
        this.retailOrderId = response.Result.MallOrderId;
        if (input.SellerAgencyId && input.SupplierId && input.SellerAgencyId == input.SupplierId) {
          this.payForOrder();
        } else {
          this.submitPeerOrder(input);
        }
      }
    }).catch(err => { console.log(err); });
  }

  private submitPeerOrder(input: any) {
    let peerInput = {
      OrderProductListInput: input.OrderProductListInput,
      OrderVisitorListInput: input.OrderVisitorListInput,
      BuildPeerOrderInfoInput: input.RetailMallOrderInfoInput
    };
    peerInput.BuildPeerOrderInfoInput.ContactName = AgencyService.CurrentAgency.ChargerName;
    peerInput.BuildPeerOrderInfoInput.ContactEmail = AgencyService.CurrentAgency.Email;
    peerInput.BuildPeerOrderInfoInput.ContactPhone = AgencyService.CurrentAgency.TelePhone;
    peerInput.BuildPeerOrderInfoInput.BuyerAgencyId = AgencyService.CurrentAgency.AgencyId;
    peerInput.BuildPeerOrderInfoInput.BuyerAgencyName = AgencyService.CurrentAgency.AgencyName;
    this.orderService.submitPeerOrder(peerInput).then(response => {
      this.payForOrder();
    }).catch();
  }

  private payForOrder() {
    if (!this.retailOrderId) return;
    this.paymentService.paymentConfirm(this.retailOrderId).then(response => {
      this.loading.hide();
      if (response.Success) {
        if (response.Result) window.location.href = response.Result;
      } else this.navCtrl.push(OrderDetailPage, { orderId: this.retailOrderId, source: "ordersubmit" });
    }).catch(err => console.log(err));
  }

  /**
   * 检查预订数量是否超出余量 返回true时为超出
   * @param input 
   */
  private remainingSeatsCheck(input: any): boolean {
    let state = 0;
    input.OrderProductListInput.forEach(p => {
      p.OrderProductDateListInput.forEach(d => {
        d.OrderProductDateQuoteListInput.forEach(q => {
          if (q.remainingSeats) {
            let rem = q.remainingSeats.split("余")[1];
            if (rem && !isNaN(rem)) {
              if (q.Quantity > rem) state++;
            }
          }
        });
      });
    });
    if (state) return true;
    return false;
  }

  private setHotelInputQuoteList(input: any) {
    let quoteList = input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput;
    input.OrderProductListInput[0].OrderProductDateListInput = [];
    input.HotelDateList.forEach(day => {
      let newDate = {
        DateId: day.AppointTimeGuid,
        OrderProductDateQuoteListInput: []
      };
      day.QuoteDtos.forEach(quote => {
        let newQuote = {
          QuoteId: quote.QuoteItemsDtos[0].Id,
          PriceType: 0,
          QuoteName: quote.QuoteName,
          Quantity: this.getHotelQuantity(quote.QuoteName, quoteList)
        };
        if (newQuote.Quantity) {
          newDate.OrderProductDateQuoteListInput.push(newQuote);
        }
      });
      if (newDate.OrderProductDateQuoteListInput.length > 0) {
        input.OrderProductListInput[0].OrderProductDateListInput.push(newDate);
      }
    });
    return input;
  }

  private getHotelQuantity(qname, quoteList) {
    let q = quoteList.filter(function (item) {
      return item.name == qname;
    })[0];
    if (q.remainingSeats == "有房") {
      return q.Quantity;
    } else {
      let remain = q.remainingSeats.split('余')[1];
      if (q.Quantity > remain) {
        return 0;
      } else {
        return q.Quantity;
      }
    }
  }

  goInvoice() {
    this.navCtrl.push(InvoicePage, { input: this.input });
  }

  goShipping() {
    this.navCtrl.push(ShippingPage, { input: this.input });
  }


  public setDefaultInvoice() {
    if (!this.input.RetailMallOrderInfoInput.Invoice.IsActive) return;
    if (this.input.RetailMallOrderInfoInput.Invoice.Title) return;
    this.loading.show();
    this.invoiceService.get().then(response => {
      if (response.Success) {
        this.loading.hide();
        let invoiceList = response.Result;
        if (invoiceList.length > 0) {
          let defaultInvoice = invoiceList.filter(function (item) {
            return item.IsDefault == true;
          })[0];
          if (!defaultInvoice) defaultInvoice = invoiceList[0];
          defaultInvoice.IsActive = true;
          this.input.RetailMallOrderInfoInput.Invoice = defaultInvoice;
        }
      }
    }).catch();
  }

  public setDefaultShipping() {
    if (!this.input.RetailMallOrderInfoInput.Shipping.IsActive) return;
    if (this.input.RetailMallOrderInfoInput.Shipping.ReceiverName) return;
    this.loading.show();
    this.shippingService.get().then(response => {
      if (response.Success) {
        this.loading.hide();
        let shippingList = response.Result;
        if (shippingList.length > 0) {
          let defaultShipping = shippingList.filter(function (item) {
            return item.IsDefault == true;
          })[0];
          if (!defaultShipping) defaultShipping = shippingList[0];
          defaultShipping.IsActive = true;
          this.input.RetailMallOrderInfoInput.Shipping = defaultShipping;
        }
      }
    }).catch();
  }

}
