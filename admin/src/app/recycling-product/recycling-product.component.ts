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
  selector: 'app-recycling-product',
  templateUrl: './recycling-product.component.html',
  styleUrls: ['./recycling-product.component.css']
})
export class RecyclingProductComponent implements OnInit {
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
  user_id: any;
  sortBy: any = -1;
  searchUserTerm: any;
  userlist: any;
  admintoken: any;
  category: any;
  sort_array=[
    {status:'Selet Order', value:""},
    {status:'Descending ', value:"desc"},
    {status:'Ascending ', value:"asc"},
    {status:'Company ', value:"company"},
    
  ]
  public loading = false;

  constructor(
    private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.size = 10;
    this.number = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.user_id = params['id'];
      var obj = {
        size: this.size,
        number: this.number,
        user_id: this.user_id
      }
      this._appservice.listRecyclingProduct(obj).subscribe((Response) => {
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
    });
  }
  loadmore() {
    this.loading = true;
    this.number = this.number + 25
    this.admintoken = localStorage.getItem('admintoken');
    var obj = {
      size: this.size,
      number: this.number
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      var user_id = params['id'];
      var obj = {
        size: this.size,
        number: this.number,
        user_id: user_id
      }
      this._appservice.listRecyclingProduct(obj).subscribe((Response) => {
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
    });
  }
  onDocTypeChange(event){
    this.sortBy=event.target.value;
    var obj = {
      size: this.size,
      number: this.number,
      user_id: this.user_id,
      sortBy: this.sortBy,
      name: this.searchUserTerm
    }
    
    
    this._appservice.listRecyclingProduct(obj).subscribe((Response) => {
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
  getSearchedUser(event){
    //this.sortBy=event.target.value;
    var obj = {
      size: this.size,
      number: this.number,
      user_id: this.user_id,
      sortBy: this.sortBy,
      name: this.searchUserTerm
    }
    this._appservice.listRecyclingProduct(obj).subscribe((Response) => {
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
  searchUserCloseTerm(){
    this.searchUserTerm="";
    var obj = {
      size: this.size,
      number: this.number,
      user_id: this.user_id,
      sortBy: this.sortBy,
      name: this.searchUserTerm
    }
    this._appservice.listRecyclingProduct(obj).subscribe((Response) => {
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

  getDetails(str: any) {
    this.loading = true;
    this.edit = true;
    this.pagetitle = 'View Details';
    var data = {
      _id: str._id
    }
    this._appservice.getRecyclingProductDetails(data).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;
          this.item = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    })

  }
}
