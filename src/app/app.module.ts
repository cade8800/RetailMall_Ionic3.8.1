import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { CalendarModule } from "ion2-calendar";
import { HttpService } from '../providers/httpService';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { LinePage } from '../pages/line/line';
import { HotelPage } from '../pages/hotel/hotel';
import { TicketPage } from '../pages/ticket/ticket';
import { AccountPage } from '../pages/account/account';
import { OrderPage } from '../pages/order/order';
import { VisitorPage } from '../pages/visitor/visitor';
import { VisitorEditPage } from '../pages/visitor-edit/visitor-edit';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderListPage } from '../pages/order-list/order-list';
import { InvoicePage } from '../pages/invoice/invoice';
import { ShippingPage } from '../pages/shipping/shipping';
import { InvoiceEditPage } from '../pages/invoice-edit/invoice-edit';
import { ShippingEditPage } from '../pages/shipping-edit/shipping-edit';
import { OrderModifyPage } from '../pages/order-modify/order-modify';
import { PagesModule } from '../pages/pages.module';
import { ToastCtrl } from '../providers/toastController';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    CalendarModule,
    HttpModule,
    PagesModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
      // pageTransition: 'ios-transition',
      swipeBackEnabled: true,
      // spinner: 'ios',
      // platforms: {
      //   android: {
      //     backButtonText: "Previous",
      //     backButtonIcon: "ios-arrow-back",
      //     iconMode: "ios",
      //     modalEnter: "modal-ios-slide-in",
      //     modalLeave: "modal-ios-slide-out"
      //   }
      // }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    LinePage,
    HotelPage,
    TicketPage,
    AccountPage,
    OrderPage,
    VisitorPage,
    VisitorEditPage,
    OrderDetailPage,
    OrderListPage,
    InvoicePage,
    ShippingPage,
    ShippingEditPage,
    InvoiceEditPage,
    OrderModifyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpService,
    ToastCtrl,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
