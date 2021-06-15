import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { CONFIG } from '../../../config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
  constructor(private _http: Http, ) { }
  getToken() {
    return localStorage.getItem('admintoken');
  }
  authHeader(headers: Headers) {
    headers.append('x-access-token', this.getToken());
  }
  private _errorHandler(error: Response) {
    return Observable.throw(error.json() || 'Server Error');
  }

  getCountries() {
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    return this._http.get(
      CONFIG.API_ENDPOINT + 'countries',
      { headers: headers }
    )
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  doLogin(loginData) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'adminLogin';
    return this._http.post(URL, loginData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  updatePassword(updateData) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'adminChangePassword';
    return this._http.post(URL, updateData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  forgotpassLinksend(forgotpassadmin) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'forgotpassLinksend';
    return this._http.post(URL, forgotpassadmin, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  forgotPassword(forgotPasswordData) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'forgotPassword';
    return this._http.post(URL, forgotPasswordData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Content list
  getAllContent(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'listContent';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Content Details
  getDetailsContent(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'detailsContent';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Edit content
  editContent(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editContent';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // All User list
  getAllUser(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'listUser';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // User Details
  getUserDetails(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'detailsUser';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // User Report
  getUserReport() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'userReport';
    return this._http.post(URL, {}, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Add recycling product type
  addRecyclingProductType(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductTypeAdd';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // list recycling product type
  listRecyclingProductType(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductTypeList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Edit recycling product type
  editRecyclingProductType(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductTypeEdit';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Delete recycling product type
  deleteRecyclingProductType(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductTypeDelete';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  ////// Dibyendu ///////
  // Add recycling product type
  addRecyclingProductMsg(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductScanMsgAdd';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // list recycling product type
  listRecyclingProductMsg(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductScanMsgList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit recycling product type
  editRecyclingProductMsg(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductScanMsgEdit';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete recycling product type
  deleteRecyclingProductMsg(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductScanMsgDelete';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  ////// Dibyendu //////

  // list recycling product type
  listRecyclingProduct(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Recycling Product Details
  getRecyclingProductDetails(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'recyclingProductDetails';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Add cause
  addCause(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    for (const key in updateFile) {
      formData.append(key, updateFile[key]);
    }
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'addCause';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit cause
  editCause(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    for (const key in updateFile) {
      formData.append(key, updateFile[key]);
    }
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editCause';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // list cause
  listCause(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'listCause';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Upload cause document
  uploadDocCause(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('doc', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'uploadDocCause';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Detail cause
  DetailCause(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'DetailCause';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Delete cause
  deleteCause(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteCause';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete cause Document
  deleteCauseDocument(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteCauseDocument';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete cause Image
  deleteCauseImage(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteCauseImage';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // list vendor
  listVendor(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'listVendor';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Add vendor
  addVendor(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('companyLogo', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'addVendor';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit vendor
  editVendor(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('companyLogo', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editVendor';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Featured set
  featuredSet(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'setFeatureVendor';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Detail vendor
  getVendorDetails(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'detailVendor';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Delete vendor
  deleteVendor(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteVendor';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

    // Add product category
    addProductCategory(data: any) {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      this.authHeader(headers);
      const options = new RequestOptions({ headers: headers });
      const URL = CONFIG.API_ENDPOINT + 'productCategoryAdd';
      return this._http.post(URL, data, options)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    // list product category
    listProductCategory(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'productCategoryList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Edit product category
  editProductCategory(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'productCategoryEdit';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Delete product category
  deleteProductCategory(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'productCategoryDelete';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Add Product
  addProduct(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    for (const key in updateFile) {
      formData.append(key, updateFile[key]);
    }
    console.log('formData', formData);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'addProduct';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit Product
  editProduct(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    for (const key in updateFile) {
      formData.append(key, updateFile[key]);
    }
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editProduct';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }


  // list product
  listProduct(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'productList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Popular set for product
  popularSet(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'setPopularProduct';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Details of product
  DetailProduct(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'DetailProduct';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Delete product
  deleteProduct(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteProduct';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete Product Image
  deleteProductImage(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteProductImage';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Setting list
  getAllSetting() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'settinglist';
    return this._http.post(URL, '', options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Setting Details
  getDetailsSetting(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'settingdetails';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit setting
  editSetting(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('image', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editsetting';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
   // list Order
   orderList(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'orderList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Change Order Status
  changeOrderStatus(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'changeOrderStatus';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Add Ads
  addAds(updateData, updateFile) {
    
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('image', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'addAds';
    
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // list Order
  adsList(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'adsList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  // Featured set
  setFeatureAds(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'setFeatureAds';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete Ads
  DeleteAds(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'DeleteAds';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit Ads
  editAds(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('image', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editAds';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Add Product barcode
  addProductBarcode(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('image', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'addProductbarcode';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // list Product barcode
  productBarcodeList(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'productBarcodeList';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Edit Product barcode
  editProductBarcode(updateData, updateFile) {
    const formData: FormData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }
    formData.append('image', updateFile);
    const headers = new Headers({ 'Accept': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'editProductBarcode';
    return this._http.post(URL, formData, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }
  // Delete Ads
  deleteProductbarcode(data: any) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.authHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.API_ENDPOINT + 'deleteProductbarcode';
    return this._http.post(URL, data, options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

      // list recycling product category
      listRecyclingProductCategory(data: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.authHeader(headers);
        const options = new RequestOptions({ headers: headers });
        const URL = CONFIG.API_ENDPOINT + 'recyclingProductTypeAllList';
        return this._http.post(URL, data, options)
          .map((response: Response) => response.json())
          .catch(this._errorHandler);
      }
}

