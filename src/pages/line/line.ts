import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OrderPage } from '../order/order';
import { ProductService } from '../../providers/productService';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { LoadCtrl } from '../../providers/loadingController';
import { Default_Slide_Img } from '../../providers/constants';
import { ToastCtrl } from '../../providers/toastController';
import { CalendarModal, CalendarModalOptions, DayConfig } from "ion2-calendar";

@IonicPage()
@Component({
  selector: 'page-line',
  templateUrl: 'line.html',
  providers: [ProductService, AccountService, LoadCtrl]
})
export class LinePage extends BasePage {

  pet: string = "product";
  private _daysConfig = [];
  info: any = { LineMainDto: { Media: {} } };
  agencyTel: string;
  input: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService: ProductService,
    private loading: LoadCtrl,
    private toastCtrl: ToastCtrl,
    public accountService: AccountService,
    private modalCtrl: ModalController) {
    super(accountService);
    this.init();
    this.agencyTel = 'tel:' + localStorage.getItem("agencyTel");
  }

  private init() {
    this.loading.show();
    let productId: string = this.navParams.get('productId');
    this.productService.getLine(productId).then(response => {
      if (response.Success) {
        this.info = response.Result;
        this.uutShareProductInit(this.info.LineMainDto.LineGuid, this.info.LineMainDto.ProductLineName, this.info.LineMainDto.Media.ImageInfoList.length > 0 ? this.info.LineMainDto.Media.ImageInfoList[0].path : '', 'line');
        this.setDayTrip();
        this.setDefaultSlideImg();
        this.setPriceOfCalendar(this.info.AppointtimeDtos);
        this.loading.hide();
      }
    }).catch();
  }

  private setDayTrip() {
    if (this.info.DayTripDto) {
      this.info.DayTripDto.forEach(element => {
        element.destinationList = [];
        if (element.Arrivals && element.TrafficWays) {
          let jsonArrivals = JSON.parse(element.Arrivals);
          let jsonTrafficWays = JSON.parse(element.TrafficWays);
          for (let i = 0; i < jsonArrivals.length; i++) {
            var ways = {
              way: this.getTripWayIcon(jsonTrafficWays[i].name),
              arrivals: jsonArrivals[i].name
            };
            element.destinationList.push(ways);
          }
        }
        if (element.Items) {
          element.Items.forEach(item => {
            if (item.ImageInfos) {
              item.ImageInfos = JSON.parse(item.ImageInfos);
            }
          });
        }
      });
    }
  }

  private getTripWayIcon(way: string) {
    let imgList = {
      "飞机": "assets/img/restype/plane.png",
      "线路": "assets/img/restype/line.png",
      "其它": "assets/img/restype/Other.png",
      "附加项": "assets/img/restype/Additional_items.png",
      "汽车": "assets/img/restype/bus.png",
      "用车": "assets/img/restype/car.png",
      "文娱": "assets/img/restype/Entertainment.png",
      "餐饮": "assets/img/restype/food.png",
      "住宿": "assets/img/restype/hotel.png",
      "购物": "assets/img/restype/shopping.png",
      "接送": "assets/img/restype/Shuttle.png",
      "火车": "assets/img/restype/train.png",
      "自由活动": "assets/img/restype/freetime.png",
      "景点": "assets/img/restype/Ticket.png",
      "集合": "assets/img/restype/set.png",
      "轮船": "assets/img/restype/ship.png",
      "步行": "assets/img/restype/walk.png"
    };
    return imgList[way];
  }

  private setDefaultSlideImg() {
    if (this.info.LineMainDto.Media.ImageInfoList.length < 1) {
      this.info.LineMainDto.Media.ImageInfoList = [{ path: Default_Slide_Img }];
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
      let hasQuote: boolean = false;
      let currentDate = new Date(dateObj.time);
      this.info.AppointtimeDtos.forEach(element => {
        if ((new Date(element.UseTime)).getTime() == currentDate.getTime()) {
          hasQuote = true;
          this.setOrderInput(element);
          this.navCtrl.push(OrderPage, { input: this.input });
        }
      });
      if (!hasQuote) {
        this.toastCtrl.show("尚无报价");
      }
    }
  }

  private setOrderInput(quoteItem: any) {
    if (quoteItem) {

      this.input = {
        RetailMallOrderInfoInput: {
          OrderType: 2,
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
          currencyCode: this.info.LineMainDto.GeneralCurrencyCode,
          SellerAgencyId: localStorage.getItem("agencyId"),
          SellerAgencyName: localStorage.getItem("agencyName"),
          SupplierId: this.info.LineMainDto.AgencyId
        },
        OrderProductListInput: [{
          ProductId: this.info.LineMainDto.LineGuid,
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
          currency: this.info.LineMainDto.GeneralCurrencyCode,
          QuoteId: item.QuoteItemsDtos[0].Id,
          PriceType: 0,
          Quantity: 0,
          remainingSeats: this.setRemainingSeats(item.IsMore, item.QuoteCount, item.SoldNumber)
        };
        this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
      });
      quoteItem.LineAdditionalItemDtos.forEach(item => {
        let quote = {
          name: item.additionalName,
          price: item.additionalPrice,
          currency: this.info.LineMainDto.GeneralCurrencyCode,
          QuoteId: item.AdditionalGuid,
          PriceType: 1,
          Quantity: 0,
          remainingSeats: ""
        };
        this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
      });

      if (this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.length > 0)
        this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput[0].Quantity = 1;
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
