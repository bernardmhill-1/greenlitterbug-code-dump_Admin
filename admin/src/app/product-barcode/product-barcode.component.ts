import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from "../../../config";
import { HighlightPipe } from '../highlight.pipe';

@Component({
  selector: 'app-product-barcode',
  templateUrl: './product-barcode.component.html',
  styleUrls: ['./product-barcode.component.css']
})
export class ProductBarcodeComponent implements OnInit {

  edit: boolean = false;
  data: any = [];
  dataVendor: any = [];
  admintoken: any;
  pagetitle: any;
  popupDiv: any;
  item: any = {};
  category: string;
  size: number;
  number: number;
  uploadfile: any;
  privewfile: any;
  data_length: any;
  allCategory : any = [];
  image_type = ['image/gif', 'image/jpeg', 'image/png', 'image/gif'];
  public loading = false;

  constructor(private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent
  ) { }

  ngOnInit() {
    this.loading = true;
    this.size = 10;
    this.number = 0;
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.productBarcodeList(obj).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;
          if (result == null || result == '' || result == undefined) {
            this.data_length = false;
          } else {
            this.data_length = true;
          }
          this.data = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    })
  }

  loadmore() {
    this.loading = true;
    this.number = this.number + 10
    this.admintoken = localStorage.getItem('admintoken');
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.productBarcodeList(obj).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;
          this.data = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    });
  }

  clear() {
    this.ngOnInit()
  }

  addNew() {
    this.edit = false
    this.pagetitle = 'Add Product Barcode';
    this.item = {}
    this.categoryList();
  }

  getDetails(str: any) {
    this.loading = true;
    this.pagetitle = 'Edit Product Barcode';
    this.edit = true;
    this.popupDiv = true;
    this.item = str;
    this.privewfile = '';
    this.categoryList();
    (document.getElementById('imageFile') as HTMLInputElement).value = null;
    this.loading = false;
  }

  onSelectImageFile(event) {
    this.uploadfile = event.target.files[0];
    if (this.image_type.includes(this.uploadfile.type)) {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event) => {
          this.privewfile = event.target['result'];
        }
        reader.readAsDataURL(event.target.files[0]);
      }
    } else {
      this._message.showError('Please enter valid image file');
      return false;
    }
  }

  saveData() {
    this.loading = true;
    var flag = 0, errorMessage;
    if (this.item.productType == '' || this.item.productType == undefined) {
      this.loading = false;
      errorMessage = 'Please select product type';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.item.name == '' || this.item.name == undefined) {
      this.loading = false;
      errorMessage = 'Please enter product name';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.item.barcode == '' || this.item.barcode == undefined) {
      this.loading = false;
      errorMessage = 'Please enter product barcode';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.edit == false && flag == 0) {
      this._appservice.addProductBarcode(this.item, this.uploadfile).subscribe((Response) => {
        this.loading = false;
        if (Response.STATUSCODE == 4002) {
          this._message.showError(Response.message);
          this._app.logoutAdmin();
        } else {
          if (Response.success) {
            this._message.showSuccess(Response.message);
            this.ngOnInit();
          } else {
            this._message.showWarning(Response.message);
          }
        }
      }, (Error) => {
        this._message.showError(Error.message)
      })
    }
    if (this.edit == true && flag == 0) {
      this._appservice.editProductBarcode(this.item, this.uploadfile).subscribe((Response) => {
        this.loading = false;
        if (Response.STATUSCODE == 4002) {
          this._message.showError(Response.message);
          this._app.logoutAdmin();
        } else {
          if (Response.success) {
            this._message.showSuccess(Response.message);
            this.ngOnInit();
          } else {
            this._message.showWarning(Response.message);
          }
        }
      }, (Error) => {
        this._message.showError(Error.message)
      })
    }
  }

  categoryList() {
    var obj = {};
    this._appservice.listRecyclingProductCategory(obj).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          this.allCategory=Response.response;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    })
  }

  deleteData(item) {
    if (confirm("Are you sure want to delete this data?")) {
      this.loading = true;
      this._appservice.deleteProductbarcode(item).subscribe((Response) => {
        this.loading = false;
        if (Response.STATUSCODE == 4002) {
          this._message.showError(Response.message);
          this.ngOnInit();
        } else {
          if (Response.success) {
            this._message.showSuccess(Response.message);
            this.ngOnInit();
          } else {
            this._message.showWarning(Response.message);
          }
        }
      }, (Error) => {
      })
    }
  }
}
