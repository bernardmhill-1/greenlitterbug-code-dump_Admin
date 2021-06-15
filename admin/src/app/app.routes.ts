import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { SettingComponent } from './setting/setting.component';
import { CmsComponent } from './cms/cms.component';
import { LoginComponent } from './login/login.component';

import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { RecyclingProductTypeComponent } from './recycling-product-type/recycling-product-type.component';
import { RecyclingProductComponent } from './recycling-product/recycling-product.component';
import { CauseComponent } from './cause/cause.component';
import { VendorComponent } from './vendor/vendor.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductComponent } from './product/product.component';
import { ProductBarcodeComponent } from './product-barcode/product-barcode.component';
import { OrderComponent } from './order/order.component';
import { AdsComponent } from './ads/ads.component';
import { AuthGuard } from './guards/index';
import { RecyclingProductScanMessageComponent } from './recycling-product-scan-message/recycling-product-scan-message.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'cms', component: CmsComponent, canActivate: [AuthGuard] },
  { path: 'cause', component: CauseComponent, canActivate: [AuthGuard] },
  { path: 'vendor', component: VendorComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'Changepassword', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'recyclingProduct/:id', component: RecyclingProductComponent, canActivate: [AuthGuard] },
  { path: 'recyclingProductType', component: RecyclingProductTypeComponent, canActivate: [AuthGuard] },
  { path: 'recyclingProductScanMessage/:id', component: RecyclingProductScanMessageComponent, canActivate: [AuthGuard] },
  { path: 'productCategory', component: ProductCategoryComponent, canActivate: [AuthGuard] },
  { path: 'productBarcode', component: ProductBarcodeComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'ads', component: AdsComponent, canActivate: [AuthGuard] },
  { path: 'forgotpassword/:id', component: ForgotpasswordComponent }
];
