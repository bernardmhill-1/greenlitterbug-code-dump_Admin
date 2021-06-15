import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  search: any = {};
  size: number;
  number: number;
  pagetitle: string;
  edit: boolean;
  userdet: boolean;
  isloggedin: boolean;
  dobyear: any[];
  item: any = {};
  //category: string;
  data: any = [];
  userlist: any;
  admintoken: any;
  category: string;
  vendor: string;
  uploadfile: any = [];
  privewfile: any = [];
  file2: any;
  urls = [];
  image_type = ['image/gif', 'image/jpeg', 'image/png', 'image/gif'];
  allCategory : any = [];
  allVendor : any = [];
  public loading = false;
  user: String = ''
  orderStatus: string;
  shipping: any;
  

  constructor(
    private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent) {
  }

  ngOnInit() {
    this.size = 10;
    this.number = 0;
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.orderList(obj).subscribe((Response) => {
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;
          //console.log('result',result);
          
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
    this.admintoken = localStorage.getItem('admintoken');
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.orderList(obj).subscribe((Response) => {
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

  changeStatus(item) {
    // console.log(e)
    // if(confirm('Are you sure want to change status?')){
    //   this.orderStatus = item.orderStatus;
      
    // }
    this.loading = true;
    var obj = { _id: item._id, orderStatus: item.orderStatus, userId: item.userId }
    this._appservice.changeOrderStatus(obj).subscribe((Response) => {
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
      console.log(Error)
    })
    
  }

  viwData(item) {
    console.log(item);
    
    this.item = item;
    this.user = item.userId.first_name+' '+item.userId.last_name
    this.shipping = item.shippingAddress;
    // this.loading = true;
    // this.edit = false
    // this.pagetitle = 'View Product Detail ';
    // this._appservice.DetailProduct(item).subscribe((Response) => {
    //   this.loading = false;
    //   if (Response.STATUSCODE == 4002) {
    //     this._message.showError(Response.message);
    //     this._app.logoutAdmin();
    //   } else {
    //     if (Response.success) {
    //       var result = Response.response;                    
    //       this.item = result;
    //       this.category = result.category;
    //       this.vendor = result.vendor;
    //     } else {
    //       this._message.showWarning(Response.message);
    //     }
    //   }
    // }, (Error) => {
    // })
    
  }

  

}

