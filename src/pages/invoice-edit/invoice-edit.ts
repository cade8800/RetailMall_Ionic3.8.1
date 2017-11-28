import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InvoicePage } from '../invoice/invoice';
import { InvoiceService } from '../../providers/invoiceService';
import { StringHelper } from '../../providers/utils';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';

@IonicPage()
@Component({
  selector: 'page-invoice-edit',
  templateUrl: 'invoice-edit.html',
  providers: [InvoiceService, LoadCtrl]
})
export class InvoiceEditPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastCtrl,
    private invoiceService: InvoiceService,
    private loading: LoadCtrl) {
    this.init();
  }

  input: any = {};
  order: any = {};
  invoice: any = {
    IsActive: false,
    IsDefault: false,
    Type: 1,
    Subject: 2,
    Address: '',
    BankAccount: '',
    BankName: '',
    PhoneNumber: '',
    TaxpayerId: '',
    Title: '',
  };
  title: string;

  private init() {
    this.input = this.navParams.get('input');
    this.order = this.navParams.get('order');
    let invoice = this.navParams.get('invoice');
    if (invoice) {
      this.title = '编辑';
      this.invoice = invoice;
    } else {
      this.title = '新增';
    }
  }


  complete() {
    if (this.invoice.Type == '1' && this.invoice.Subject == '2') {
      if (!StringHelper.trim(this.invoice.Title) || !StringHelper.trim(this.invoice.TaxpayerId)) {
        this.toastCtrl.show('请完善发票信息！');
        return;
      }
    }
    if (this.invoice.Type == '1' && this.invoice.Subject == '1') {
      if (!StringHelper.trim(this.invoice.Title)) {
        this.toastCtrl.show('请完善发票信息！');
        return;
      }
    }
    if (this.invoice.Type == '2' && this.invoice.Subject == '2') {
      if (!StringHelper.trim(this.invoice.Title) || !StringHelper.trim(this.invoice.TaxpayerId) || !StringHelper.trim(this.invoice.PhoneNumber)
        || !StringHelper.trim(this.invoice.Address) || !StringHelper.trim(this.invoice.BankName) || !StringHelper.trim(this.invoice.BankAccount)) {
        this.toastCtrl.show('请完善发票信息！');
        return;
      }
    }
    if (this.title == '编辑') {
      this.loading.show();
      this.invoiceService.update(this.invoice.Id, this.invoice).then(response => {
        console.log(response);
        if (response.Success) {
          this.loading.hide();
          this.navCtrl.push(InvoicePage, { input: this.input, order: this.order });
        }
      }).catch(err => {
        console.log(err);
        this.toastCtrl.show('请完善发票信息');
        this.loading.hide();
      });
    } else if (this.title == '新增') {
      this.loading.show();
      this.invoiceService.add(this.invoice).then(response => {
        console.log(response);
        if (response.Success) {
          this.loading.hide();
          this.navCtrl.push(InvoicePage, { input: this.input, order: this.order });
        }
      }).catch(err => {
        console.log(err);
        this.toastCtrl.show('请完善发票信息');
        this.loading.hide();
      });
    }
  }

}
