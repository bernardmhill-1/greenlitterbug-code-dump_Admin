import { NgModule, ViewContainerRef } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { UserService } from './userservice/user.service';
import { MessageService } from './userservice/message.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Broadcaster } from './broadcaster';
import { HighlightPipe } from './highlight.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'angular2-moment';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { CmsComponent } from './cms/cms.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';

import { ToastrModule } from 'ngx-toastr';
import { NgDatepickerModule } from 'ng2-datepicker';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { AuthGuard } from './guards/index';

//import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from 'ng2-ckeditor';
import { RecyclingProductTypeComponent } from './recycling-product-type/recycling-product-type.component';
import { RecyclingProductComponent } from './recycling-product/recycling-product.component';
import { CauseComponent } from './cause/cause.component';
import { VendorComponent } from './vendor/vendor.component';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxLoadingModule } from 'ngx-loading';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { AdsComponent } from './ads/ads.component';
import { ProductBarcodeComponent } from './product-barcode/product-barcode.component';
import { RecyclingProductScanMessageComponent } from './recycling-product-scan-message/recycling-product-scan-message.component';



@NgModule({
  declarations: [
    AppComponent,
    HighlightPipe,
    DashboardComponent,
    UserComponent,
    SettingComponent,
    CmsComponent,
    LoginComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent,
    RecyclingProductTypeComponent,
    RecyclingProductComponent,
    CauseComponent,
    VendorComponent,
    ProductCategoryComponent,
    ProductComponent,
    OrderComponent,
    AdsComponent,
    ProductBarcodeComponent,
    RecyclingProductScanMessageComponent,
  ],
  imports: [
    BrowserModule, ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule, BrowserAnimationsModule,
    HttpModule,
    CKEditorModule,
    NgDatepickerModule,
    Ng2DatetimePickerModule,
    BsDatepickerModule.forRoot(),
    MomentModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],

  providers: [

    Broadcaster,
    UserService, MessageService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
