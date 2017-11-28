import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProductService } from '../../providers/productService';
import { Default_Slide_Img } from '../../providers/constants';
import { OrderPage } from '../order/order';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { LoadCtrl } from '../../providers/loadingController';
import { CalendarModal, CalendarModalOptions, DayConfig } from "ion2-calendar";

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
  providers: [ProductService, AccountService, LoadCtrl]
})

export class TicketPage extends BasePage {

  pet: string = "recommend";
  info: any = { Media: {} };
  private _daysConfig = [];
  agencyTel: string;
  input: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loading: LoadCtrl,
    private productService: ProductService,
    public accountService: AccountService,
    private modalCtrl: ModalController) {
    super(accountService);
    this.init();
    this.agencyTel = 'tel:' + localStorage.getItem("agencyTel");
  }

  private init() {
    this.loading.show();
    let productId: string = this.navParams.get('productId');
    this.productService.getTicket(productId).then(response => {
      if (response.Success) {
        this.info = response.Result;
        this.uutShareProductInit(this.info.TicketGuid, this.info.TicketName, this.info.Media.ImageInfoList.length > 0 ? this.info.Media.ImageInfoList[0].path : '', 'ticket');
        this.setDefaultSlideImg();
        this.setPriceOfCalendar(this.info.AppointtimeDtos);
        this.loading.hide();
      }
    }).catch();
  }

  private setDefaultSlideImg() {
    if (this.info.Media.ImageInfoList.length < 1) {
      this.info.Media.ImageInfoList = [{ path: Default_Slide_Img }];
    }
  }

  private setPriceOfCalendar(timeList: any) {
    if (timeList) {
      timeList.forEach(element => {
        let item: DayConfig = {
          date: new Date(element.UseTime),
          subTitle: element.LowestPriceOfToday,
          cssClass: 'dayclass'
        };
        this._daysConfig.push(item);
      });
    }
  }

  booking() {
    this.openCalendar(this._daysConfig);
  }

  private openCalendar(daysConfig) {
    // this.calendarCtrl.openCalendar({
    //   isRadio: true,
    //   weekdaysTitle: ['日', '一', '二', '三', '四', '五', '六'],
    //   monthTitle: "yyyy 年 MM 月",
    //   title: "选择日期",
    //   closeLabel: "取消",
    //   daysConfig: daysConfig
    // }).then(res => {
    //   this.onSelectDate(res);
    // }).catch((err) => {
    //   // console.log("没有选择");
    // });


    const options: CalendarModalOptions = {
      title: '选择日期',
      color: 'secondary',
      pickMode: 'single',
      monthFormat: 'YYYY 年 MM 月 ',
      weekdays: ['天', '一', '二', '三', '四', '五', '六'],
      closeLabel: '取消',
      doneLabel: '完成',
      autoDone: true,
      daysConfig: daysConfig
    };
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });
    myCalendar.present();
    myCalendar.onDidDismiss(date => {
      this.onSelectDate(date);
    });
  }

  private onSelectDate(dateObj: any) {
    if (dateObj) {
      let currentDate = new Date(dateObj.time);
      this.info.AppointtimeDtos.forEach(element => {
        if ((new Date(element.UseTime)).getTime() == currentDate.getTime()) {
          this.setOrderInput(element);
          this.navCtrl.push(OrderPage, { input: this.input });
        }
      });
    }
  }

  private setOrderInput(quoteItem: any) {
    if (quoteItem) {
      this.input = {
        RetailMallOrderInfoInput: {
          OrderType: 4,
          // OccupiedType: 1,
          ContactName: '',
          ContactPhone: '',
          ContactEmail: '',
          Invoice: {
            IsActive: false
          },
          Shipping: {
            IsActive: false
          },
          currencyCode: this.info.ProductCurrencyCode,
          SellerAgencyId: localStorage.getItem("agencyId"),
          SellerAgencyName: localStorage.getItem("agencyName"),
          SupplierId: this.info.AgencyId
        },
        OrderProductListInput: [{
          ProductId: this.info.TicketGuid,
          OrderProductDateListInput: [{
            DateId: quoteItem.AppointTimeGuid,
            OrderProductDateQuoteListInput: []
          }]
        }],
        OrderVisitorListInput: []
      };
      quoteItem.QuoteDtos.forEach(item => {
        let quote = {
          QuoteName: item.QuoteName,
          price: item.QuoteItemsDtos[0].SalePrice,
          currency: this.info.ProductCurrencyCode,
          QuoteId: item.QuoteItemsDtos[0].Id,
          PriceType: 0,
          Quantity: 1,
          remainingSeats: this.setRemainingSeats(item.IsMore, item.QuoteCount, item.SoldNumber)
        };
        this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
      });
      // console.log(this.input);
    }
  }

  private setRemainingSeats(IsMore, QuoteCount, SoldNumber) {
    if (IsMore) {
      return "有位";
    } else {
      return "余" + (QuoteCount - SoldNumber);
    }
  }

}
