import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VisitorService } from '../../providers/visitorService';
import { VisitorPage } from '../visitor/visitor';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { StringHelper } from '../../providers/utils';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';

@IonicPage()
@Component({
  selector: 'page-visitor-edit',
  templateUrl: 'visitor-edit.html',
  providers: [VisitorService, AccountService, LoadCtrl]
})

export class VisitorEditPage extends BasePage {

  title: string;
  visitor: any = {
    VisitorEmail: '',
    VisitorGender: 1,
    VisitorName: '',
    VisitorPhone: '',
    VisitorType: 1,
    CredentialType: 1,
    CredentialNumber: '',
    InputSource: 1,
    Birthday: ''
  };
  input: any = {};
  order: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastCtrl,
    private visitorService: VisitorService,
    private loading: LoadCtrl,
    public accountService: AccountService) {
    super(accountService);
    this.init();
  }

  private init() {
    this.input = this.navParams.get("input");
    this.order = this.navParams.get("order");
    if (this.input && this.input.VisitorName) {
      this.title = "编辑";
      this.visitor = this.input;
    } else {
      this.title = "添加";
      this.visitor.InputSource = 1;
    }
  }

  saveVisitor() {
    if (!StringHelper.trim(this.visitor.VisitorName)) {
      this.toastCtrl.show("游客名称不可为空");
      return;
    }
    if (!this.visitor.VisitorType) {
      this.toastCtrl.show("请选择游客类型");
      return;
    }
    if (!this.visitor.CredentialType) {
      this.toastCtrl.show("请选择证件类型");
      return;
    }
    if (!StringHelper.trim(this.visitor.CredentialNumber)) {
      this.toastCtrl.show("证件号码不可为空");
      return;
    }
    if (!this.visitor.Birthday) {
      this.toastCtrl.show("出生日期不可为空");
      return;
    }
    this.setCredentialTypeCn();
    if (this.title == "编辑") {
      this.updateVisitor();
    } else if (this.title == "添加") {
      this.addVisitor();
    }
  }

  private setCredentialTypeCn() {
    let typeText = {
      "1": "身份证",
      "2": "护照",
      "4": "台胞证",
      "8": "军官证",
      "16": "其它证件"
    };
    this.visitor.CredentialTypeCn = typeText[this.visitor.CredentialType];
  }

  private updateVisitor() {
    this.loading.show();
    this.visitorService.update(this.visitor).then(response => {
      if (response.Success) {
        this.toastCtrl.show("编辑保存成功！");
        this.navCtrl.pop();
        this.loading.hide();
      } else this.loading.hide();
    }).catch(err => {
      console.log(err);
      this.toastCtrl.show('请完善游客信息');
      this.loading.hide();
    });
  }

  private addVisitor() {
    this.loading.show();
    this.visitorService.insert(this.visitor).then(response => {
      if (response.Success) {
        this.toastCtrl.show("添加成功！");
        this.loading.hide();
        if (this.input) {
          this.navCtrl.push(VisitorPage, { input: this.input });
        } else if (this.order) {
          this.navCtrl.push(VisitorPage, { order: this.order });
        }
      } else this.loading.hide();
    }).catch(err => {
      console.log(err);
      this.toastCtrl.show('请完善游客信息');
      this.loading.hide();
    });
  }

}
