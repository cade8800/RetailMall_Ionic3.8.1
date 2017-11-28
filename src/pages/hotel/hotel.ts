import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProductService } from '../../providers/productService';
import { Default_Slide_Img } from '../../providers/constants';
import { OrderPage } from '../order/order';
import { DateTimeHelper } from '../../providers/utils';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { LoadCtrl } from '../../providers/loadingController';
import { ToastCtrl } from '../../providers/toastController';
import { CalendarModal, CalendarModalOptions, DayConfig } from "ion2-calendar";


@IonicPage()
@Component({
  selector: 'page-hotel',
  templateUrl: 'hotel.html',
  providers: [ProductService, DateTimeHelper, AccountService, LoadCtrl]
})
export class HotelPage extends BasePage {

  pet: string = "facilities";
  private _daysConfig = [];
  info: any = { Media: {} };
  agencyTel: string;
  input: any = {};
  dateDiff: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loading: LoadCtrl,
    private productService: ProductService,
    private toastCtrl: ToastCtrl,
    private dateTimeHelper: DateTimeHelper,
    public accountService: AccountService,
    private modalCtrl: ModalController) {
    super(accountService);
    this.init();
    this.agencyTel = 'tel:' + localStorage.getItem("agencyTel");
  }

  private init() {
    this.loading.show();
    let productId: string = this.navParams.get('productId');
    this.productService.getHotel(productId).then(response => {
      if (response.Success) {
        this.info = response.Result;
        this.uutShareProductInit(this.info.HotelGuid, this.info.HotelName, this.info.Media.ImageInfoList.length > 0 ? this.info.Media.ImageInfoList[0].path : '', 'hotel')
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

  private openCalendar(daysConfig) {
    // this.calendarCtrl.openCalendar({
    //   isRadio: false,
    //   weekdaysTitle: ['日', '一', '二', '三', '四', '五', '六'],
    //   monthTitle: "yyyy 年 MM 月",
    //   title: "选择入住退房时间",
    //   closeLabel: "取消",
    //   daysConfig: daysConfig
    // }).then(res => {
    //   this.onSelectDate(res);
    // }).catch((err) => {
    //   console.log("没有选择");
    // });



    const options: CalendarModalOptions = {
      title: '选择入住退房时间',
      color: 'secondary',
      pickMode: 'range',
      monthFormat: 'YYYY 年 MM 月 ',
      weekdays: ['天', '一', '二', '三', '四', '五', '六'],
      closeLabel: '取消',
      doneLabel: '完成',
      // autoDone: true,
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

  booking() {
    this.openCalendar(this._daysConfig);
  }

  /**
   * 选择日期后处理方法
   * @param dateObj 
   */
  private onSelectDate(dateObj: any) {
    if (dateObj) {
      let startDate = new Date(dateObj.from.time);
      let endDate = new Date(dateObj.to.time);
      let dateList = [];
      this.dateDiff = this.dateTimeHelper.getDateDiff(startDate, endDate);
      this.info.AppointtimeDtos.forEach(element => {
        let currentDate = new Date(element.UseTime);
        if (this.dateTimeHelper.isDateInSpecifiedPeriod(currentDate, startDate, endDate)) {
          dateList.push(element);
        }
      });

      if (dateList.length == this.dateDiff) {
        this.setInputInfo(startDate, endDate);
        this.setDateListInput(dateList);
      } else {
        this.toastCtrl.show("暂无合适房型");
      }

    }
  }


  /**
   * 设置input基础信息
   */
  private setInputInfo(sDate, eDate) {
    this.input = {
      RetailMallOrderInfoInput: {
        OrderType: 8,
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
        ProductId: this.info.HotelGuid,
        OrderProductDateListInput: [
          {
            DateId: "",
            OrderProductDateQuoteListInput: []
          }
        ]
      }],
      OrderVisitorListInput: [],
      bookTimeInfo: {
        startDate: sDate,
        endDate: eDate,
        dateDiff: this.dateDiff
      }
    };
  }

  /**
   * 设置input日期列表 
   * @param dateList 
   */
  private setDateListInput(dateList: any) {
    let quoteNameList = this.getQuoteNameList(dateList);
    if (quoteNameList.length > 0) {
      dateList = this.getValidDateQuoteList(dateList, quoteNameList);
      this.input.HotelDateList = dateList;
      this.setInputQuoteList(quoteNameList, dateList);
      if (this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.length < 1) {
        this.toastCtrl.show("暂无合适房型");
      } else {
        this.navCtrl.push(OrderPage, { input: this.input });
      }
    } else {
      this.toastCtrl.show("暂无合适房型");
    }
  }

  /**
   * 设置Input报价列表 
   * @param quoteNameList 
   * @param dateList 
   */
  private setInputQuoteList(quoteNameList, dateList) {
    quoteNameList.forEach(qName => {
      let quote = {
        name: qName,
        QuoteName: qName,
        currency: this.info.ProductCurrencyCode,
        QuoteId: '',
        PriceType: 0,
        Quantity: 1,
        price: this.getAveragePrice(qName, dateList),
        remainingSeats: this.setRemainingSeats(qName, dateList)
      };
      if (quote.price && quote.remainingSeats)
        this.input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
    });
  }

  /**
   * 获取均价
   * @param qname 
   * @param dateList 
   */
  private getAveragePrice(qname: string, dateList: any) {
    let total = 0;
    let isVaild: boolean = true;
    dateList.forEach(day => {
      day.QuoteDtos.forEach(quote => {
        if (quote.QuoteName == qname) {
          if (quote.QuoteItemsDtos[0]) total += quote.QuoteItemsDtos[0].SalePrice;
          else isVaild = false;
        }
      });
    });

    if (isVaild) {
      if (total > 0)
        return total / dateList.length;
      else return 0;
    } else {
      return 0;
    }
  }

  /**
   * 过滤掉日期列表下无效的报价项
   * @param dateList 
   * @param quoteNameList 
   */
  private getValidDateQuoteList(dateList: any, quoteNameList: any) {
    dateList.forEach(day => {
      day.QuoteDtos = day.QuoteDtos.filter(function (item) {
        return (quoteNameList.indexOf(item.QuoteName) > -1);
      });
    });
    return dateList;
  }

  /**
   * 获取有效的报价项名称列表
   * @param dateList 
   */
  private getQuoteNameList(dateList: any) {
    let quoteNameList = [];
    let quoteNameListOnly = [];
    dateList.forEach(day => {
      day.QuoteDtos.forEach(quote => {
        quoteNameList.push(quote.QuoteName);
        if (quoteNameListOnly.indexOf(quote.QuoteName) == -1) {
          quoteNameListOnly.push(quote.QuoteName);
        }
      });
    });
    let quoteNameListEnd = [];
    quoteNameListOnly.forEach(n => {
      var qCount = quoteNameList.filter(function (item) {
        return item == n;
      }).length;
      if (qCount == this.dateDiff) {
        quoteNameListEnd.push(n);
      }
    });
    return quoteNameListEnd;
  }

  /**
   * 获取余位
   * @param qname 
   * @param dateList 
   */
  private setRemainingSeats(qname: string, dateList: any) {
    let residue = 0;
    let isMore: boolean = true;
    let isVaild: boolean = true;
    dateList.forEach(day => {
      day.QuoteDtos.forEach(quote => {
        if (quote.QuoteName == qname) {
          if (!quote.IsMore) {
            isMore = false;
            if ((quote.QuoteCount - quote.SoldNumber) < 1) {
              isVaild = false;
            } else {
              if (residue == 0) {
                residue = quote.QuoteCount - quote.SoldNumber;
              } else {
                residue = residue < (quote.QuoteCount - quote.SoldNumber) ? residue : (quote.QuoteCount - quote.SoldNumber);
              }
            }
          }
        }
      });
    });

    if (isVaild) {
      if (isMore) {
        return "有房";
      } else {
        return "余" + residue;
      }
    } else {
      return 0;
    }

  }

}
