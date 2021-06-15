import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from "../../../config";
import { HighlightPipe } from '../highlight.pipe';


@Component({
  selector: 'vendor',
  styleUrls: ['./vendor.component.css'],
  templateUrl: './vendor.component.html',
})
// class Select
export class VendorComponent implements OnInit {
  edit: boolean;
  data: any = [];
  admintoken: any;
  pagetitle: any;
  popupDiv: any;
  item: any = {};
  size: number;
  number: number;
  uploadfile: any;
  privewfile: any;
  image_type = ['image/gif', 'image/jpeg', 'image/png', 'image/gif'];
  public loading = false;

  constructor(private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent
  ) { }

  ngOnInit(): void {
    this.size = 10;
    this.number = 0;
    var obj = {
      size: this.size,
      number: this.number
    }
    this.admintoken = localStorage.getItem('admintoken');
    this._appservice.listVendor(obj).subscribe((Response) => {
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;
          this.data = result;
        } else {
          if (Response.code == 4000) {
            this._message.showError(Response.message);
            this._app.logoutAdmin();
          } else {
            this._message.showWarning(Response.message);
          }
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
    this._appservice.listVendor(obj).subscribe((Response) => {
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
    this.pagetitle = 'Add Vendor';
    this.item = {}
    this.uploadfile = '';
    this.privewfile = '';
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }
  editC() {
    this.edit = true
    this.pagetitle = 'Edit Vendor';
    this.uploadfile = '';
    this.privewfile = '';
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
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
    var flag = 0, errorMessage;
    var img_val = /\.(jpe?g|png|gif|jpg|JPE?G|PNG|GIF|JPG)$/i;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log('upload', this.uploadfile);
    if (this.item.companyName == '' || this.item.companyName == undefined) {
      errorMessage = 'Please enter company name';
      this._message.showError(errorMessage);
      return false;
    } else if (this.item.ownerName == '' || this.item.ownerName == undefined) {
      errorMessage = 'Please enter owner name';
      this._message.showError(errorMessage);
      return false;
    } else if (this.uploadfile != '' && this.uploadfile != null && this.uploadfile != undefined && !img_val.test(this.uploadfile.name)) {
      errorMessage = 'Please enter valid image file';
      flag = 1;
      this._message.showError(errorMessage);
      return false;
    } else if (this.item.description == '' || this.item.description == undefined) {
      errorMessage = 'Please enter description';
      this._message.showError(errorMessage);
      return false;
    } else if (this.item.email == '' || this.item.email == undefined) {
      errorMessage = 'Please enter email address';
      this._message.showError(errorMessage);
      return false;
    } else if (!re.test(String((this.item.email).toLowerCase()))) {
      errorMessage = 'Please enter valid email address';
      this._message.showError(errorMessage);
      return false;
    } else {
      if (this.edit == false) {
        this.loading = true;
        this._appservice.addVendor(this.item, this.uploadfile).subscribe((Response) => {
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
        })
      }else{
        this.loading = true;
        this._appservice.editVendor(this.item, this.uploadfile).subscribe((Response) => {
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
        })

      }
    }
  }

  featuredSet(item) {
    this.loading = true;
    if (item.isFeatured == 'yes') {
      var isFeatured = 'no';
    } else {
      var isFeatured = 'yes';
    }
    var obj = { _id: item._id, isFeatured: isFeatured }
    this._appservice.featuredSet(obj).subscribe((Response) => {
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

  getDetails(str: any) {
    this.loading = true;
    this.edit = true;
    this.popupDiv = true;
    this.pagetitle = 'View Details';
    var data = {
      _id: str._id
    }
    this._appservice.getVendorDetails(data).subscribe((Response) => {
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

  deleteData(item) {
    if (confirm("Are you sure want to delete this data?")) {
      this.loading = true;
      this._appservice.deleteVendor(item).subscribe((Response) => {
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
