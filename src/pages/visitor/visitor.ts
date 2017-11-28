import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { VisitorEditPage } from '../visitor-edit/visitor-edit';
import { VisitorService } from '../../providers/visitorService';
import { OrderPage } from '../order/order';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { OrderModifyPage } from '../order-modify/order-modify';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';


@IonicPage()
@Component({
  selector: 'page-visitor',
  templateUrl: 'visitor.html',
  providers: [VisitorService, AccountService, LoadCtrl]
})
export class VisitorPage extends BasePage {

  input: any = {};
  order: any = {};
  visitorList: any[] = [];
  checkVisitorCount: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public visitorService: VisitorService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastCtrl,
    private loading: LoadCtrl,
    public accountService: AccountService) {
    super(accountService);
    this.init();
  }

  private init() {
    this.input = this.navParams.get("input");
    this.order = this.navParams.get("order");
    this.loading.show();
    this.visitorService.select().then(response => {
      if (response.Success) {
        this.visitorList = response.Result;
        this.setVisitorChecked();
        this.updateCucumber();
        this.loading.hide();
      } else this.loading.hide();
    }).catch();
  }

  private setVisitorChecked() {
    let checkedIdList = [];
    if (this.input && this.input.OrderVisitorListInput) {
      this.input.OrderVisitorListInput.forEach(cke => {
        checkedIdList.push(cke.Id);
      });
    } else if (this.order) {
      this.order.VisitorList.forEach(cke => {
        checkedIdList.push(cke.Id);
      });
    }
    this.visitorList.forEach(vis => {
      if (checkedIdList.indexOf(vis.Id) > -1) {
        vis.checked = true;
      } else vis.checked = false;
    });
  }

  addVisitor() {
    this.navCtrl.push(VisitorEditPage, { input: this.input, order: this.order });
  }

  editVisitor(vis: any) {
    this.navCtrl.push(VisitorEditPage, { input: vis });
  }

  deleteVisitor(vis: any) {
    let confirm = this.alertCtrl.create({
      title: '删除提示',
      message: '确定删除该常用游客吗？',
      buttons: [{ text: '取消' }, {
        text: '确定',
        handler: () => {
          this.visitorService.delete(vis.Id).then(response => {
            if (response.Success) {
              this.visitorList.splice(this.visitorList.indexOf(vis), 1);
              this.toastCtrl.show("删除成功");
            }
          });
        }
      }]
    });
    confirm.present();
  }

  private updateCucumber() {
    this.checkVisitorCount = this.visitorList.filter(function (item) {
      return item.checked == true;
    }).length;
  }

  submitVisitor() {
    if (this.input) {
      this.input.OrderVisitorListInput = this.visitorList.filter(function (item) {
        return item.checked == true;
      });
      if (this.input.OrderVisitorListInput.length > 0)
        this.navCtrl.push(OrderPage, { input: this.input });
      else {
        if (this.visitorList.length > 0) this.toastCtrl.show('请选择游客');
        else this.toastCtrl.show('请添加并选择游客');
      }
    } else if (this.order) {
      this.order.VisitorList = this.visitorList.filter(function (item) {
        return item.checked == true;
      });
      this.navCtrl.push(OrderModifyPage, { order: this.order });
    }
  }

}
