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
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
// class Select
export class AdsComponent implements OnInit {
  edit: boolean = false;
  data: any = [];
  dataVendor: any = [];
  admintoken: any;
  pagetitle: any;
  popupDiv: any;
  item: any = {};
  vendorId: any = '';
  //itemVendor: any = {};
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
    this.listAdds()
    this.listVendor()
  }
  listAdds(){
    this.size = 10;
    this.number = 0;
    var obj = {
      size: this.size,
      number: this.number
    }
    this.admintoken = localStorage.getItem('admintoken');
    this._appservice.adsList(obj).subscribe((Response) => {
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

  listVendor(){
    this.size = 100;
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
          this.dataVendor = result;
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
    this._appservice.adsList(obj).subscribe((Response) => {
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
    this.pagetitle = 'Add Ads';
    this.item = {}
    this.uploadfile = '';
    this.privewfile = '';
    this.vendorId = '';
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }
  editC() {
    this.edit = true
    this.pagetitle = 'Edit Ads';
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
    if (!this.vendorId) {
      errorMessage = 'Please select vendor';
      this._message.showError(errorMessage);
      return false;
    } else if (!this.item.content) {
      errorMessage = 'Please enter content';
      this._message.showError(errorMessage);
      return false;
    } else if (!this.uploadfile && !this.edit) {
      errorMessage = 'Please upload file';
      this._message.showError(errorMessage);
      return false;
    } else if (!this.edit && this.uploadfile != '' && this.uploadfile != null && this.uploadfile != undefined && !img_val.test(this.uploadfile.name)) {
      errorMessage = 'Please enter valid image file';
      flag = 1;
      this._message.showError(errorMessage);
      return false;
    } else {
      this.item.vendorId = this.vendorId;
      //delete this.item._id;
      console.log("iiiiiiiiii--",this.item);
      

      if (this.edit == false) {
        //alert(123)
        this.loading = true;
        this._appservice.addAds(this.item, this.uploadfile).subscribe((Response) => {
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
        this._appservice.editAds(this.item, this.uploadfile).subscribe((Response) => {
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
    this._appservice.setFeatureAds(obj).subscribe((Response) => {
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
    this.item = str;
    // console.log(this.item);
     this.vendorId = this.item.vendorId._id;
    
    // this.loading = true;
    // this.edit = true;
    // this.popupDiv = true;
    // this.pagetitle = 'View Details';
    // var data = {
    //   _id: str._id
    // }
    // this._appservice.getVendorDetails(data).subscribe((Response) => {
    //   this.loading = false;
    //   if (Response.STATUSCODE == 4002) {
    //     this._message.showError(Response.message);
    //     this._app.logoutAdmin();
    //   } else {
    //     if (Response.success) {
    //       var result = Response.response;
    //       this.item = result;
    //     } else {
    //       this._message.showWarning(Response.message);
    //     }
    //   }
    // }, (Error) => {
    // })

  }

  deleteData(item) {
    if (confirm("Are you sure want to delete this data?")) {
      this.loading = true;
      this._appservice.DeleteAds(item).subscribe((Response) => {
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

