import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountService } from '../../providers/accountService';
import { Default_User_Img } from "../../providers/constants";
import { OrderListPage } from '../order-list/order-list';
import { BasePage } from '../../providers/basePage';


@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers: [AccountService]
})

export class AccountPage extends BasePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public accountService: AccountService) {
    super(accountService);
    this.init();
  }

  userInfo: any = {
    MeUrl: "javascript:;"
  };

  private init() {
    // let loader = this.loadingCtrl.create();
    // loader.present();
    this.accountService.getInfo().then(response => {

      if (response.Success) {
        this.userInfo = response.Result;

        if (!this.userInfo.ProfileImage) {
          this.userInfo.ProfileImage = Default_User_Img;
        } else {
          this.userInfo.ProfileImage = "data:image/png;base64," + this.userInfo.ProfileImage;
        }
        // loader.dismiss();
      } else {
        // this.navCtrl.pop();
      }

    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  goMyOrder() {
    this.navCtrl.push(OrderListPage);
  }

}
