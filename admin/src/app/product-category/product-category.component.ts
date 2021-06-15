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
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  search: any = {};
  size: number;
  number: number;
  pagetitle: string;
  edit: boolean;
  userdet: boolean;
  isloggedin: boolean;
  dobyear: any[];
  item: any = {}
  data: any = [];
  userlist: any;
  admintoken: any;
  category: any;
  public loading = false;
  constructor(
    private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent) {
  }

  ngOnInit() {
    this.loading = true;
    this.size = 10;
    this.number = 0;
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.listProductCategory(obj).subscribe((Response) => {
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
    })
  }
  loadmore() {
    this.loading = true;
    this.number = this.number + 1
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.listProductCategory(obj).subscribe((Response) => {
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
    })
  }
  clear() {
    this.ngOnInit()
  }
  addNew() {
    this.edit = false
    this.pagetitle = 'Add Product Category';
    this.item = {}
  }
  getDetails(str: any) {
    this.edit = true;
    this.pagetitle = 'Edit Product Category';
    this.item = str;
  }
  saveData() {
    this.loading = true;
    var flag = 0, errorMessage;
    if (this.item.category == '' || this.item.category == undefined) {
      errorMessage = 'Please enter product category name';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.edit == false && flag == 0) {
      this._appservice.addProductCategory(this.item).subscribe((Response) => {
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
      this._appservice.editProductCategory(this.item).subscribe((Response) => {
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
  deleteData(item) {
    if (confirm("Are you sure want to delete this data?")) {
      this.loading = true;
      this._appservice.deleteProductCategory(item).subscribe((Response) => {
        this.loading = false;
        if (Response.success) {
          this._message.showSuccess(Response.message);
          this.ngOnInit();
        } else {
          this._message.showWarning(Response.message);
        }
      }, (Error) => {
        this._message.showError(Error)
      })
    }
  }
}
