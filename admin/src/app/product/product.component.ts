import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from "../../../config";
import { HighlightPipe } from '../highlight.pipe';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
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
    this._appservice.listProduct(obj).subscribe((Response) => {
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
    this.number = this.number + 10
    this.admintoken = localStorage.getItem('admintoken');
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.listProduct(obj).subscribe((Response) => {
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

  popularSet(item) {
    this.loading = true;
    if (item.isPopular == 'yes') {
      var isPopular = 'no';
    } else {
      var isPopular = 'yes';
    }
    var obj = { _id: item._id, isPopular: isPopular }
    this._appservice.popularSet(obj).subscribe((Response) => {
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
    this.loading = true;
    this.edit = false
    this.pagetitle = 'View Product Detail ';
    this._appservice.DetailProduct(item).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          var result = Response.response;                    
          this.item = result;
          this.category = result.category;
          this.vendor = result.vendor;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    })
    this.categoryList();
    this.vendorList();
  }

  deleteData(item) {
    if (confirm("Are you sure want to delete this data?")) {
      this.loading = true;
      this._appservice.deleteProduct(item).subscribe((Response) => {
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

  categoryList() {
    var obj = {};
    this._appservice.listProductCategory(obj).subscribe((Response) => {
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

  vendorList() {
    var obj = {};
    this._appservice.listVendor(obj).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          this.allVendor=Response.response;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    })
  }
  
  addNew() {
    this.edit = false
    this.pagetitle = 'Add Product';
    this.item = {}
    this.item.category = '';
    this.item.vendor = '';
    this.uploadfile = [];
    this.privewfile = [];
    this.categoryList();
    this.vendorList();
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }
  async editC(str) {
    this.viwData(str) 
    this.edit = true;
    this.pagetitle = 'Edit Product';
    this.uploadfile = [];
    this.privewfile = [];
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }

  onSelectImageFile(event) {
    var total_file_count = event.target.files.length;
    if (total_file_count > 0) {
      var count = 0;
      for (var f = 0; f < total_file_count; f++) {
        this.uploadfile[f] = event.target.files[f];
        if (this.image_type.includes(this.uploadfile[f].type)) {
          if (event.target.files && event.target.files[f]) {
            var reader = new FileReader();
            reader.onload = (event) => {
              this.privewfile[count] = event.target['result'];
              count++;
            }
            reader.readAsDataURL(event.target.files[f]);
          }
        } else {
          this._message.showError('Please enter valid image file');
          return false;
        }
      }
    }
  }

  saveData() {
    this.item.category = this.category;
    this.item.vendor = this.vendor;
    var flag = 0, errorMessage, isSplChar_name, re;
    re = /^([a-zA-Z ]+)$/;
    isSplChar_name = !re.test(this.item.description);
    if (this.item.name == '' || this.item.name == undefined) {
      errorMessage = 'Please enter product name';
      this._message.showError(errorMessage);
      return false;
    } else if (this.item.qty == '' || this.item.qty == undefined) {
      errorMessage = 'Please enter product quantity';
      this._message.showError(errorMessage)
      return false;
    } else if (this.item.point == '' || this.item.point == undefined) {
      errorMessage = 'Please enter product point';
      this._message.showError(errorMessage)
      return false;
    } else if (this.item.category == '' || this.item.category == undefined) {
      errorMessage = 'Please select category';
      this._message.showError(errorMessage)
      return false;
    } else if (this.item.vendor == '' || this.item.vendor == undefined) {
      errorMessage = 'Please select vendor';
      this._message.showError(errorMessage)
      return false;
    } else if (this.item.description == '' || this.item.description == undefined) {
      errorMessage = 'Please enter description';
      this._message.showError(errorMessage)
      return false;
    } else if (this.uploadfile.length == 0  && !this.edit) {
      errorMessage = 'Please upload image';
      this._message.showError(errorMessage);
      return false;
    } else {
      if (this.edit == false) {
        this.loading = true;
        this._appservice.addProduct(this.item, this.uploadfile).subscribe((Response) => {
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
        this._appservice.editProduct(this.item, this.uploadfile).subscribe((Response) => {
          this.loading = false;
          if (Response.STATUSCODE === 4002) {
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
        });
      }
    }
  }
  // Delete Image
  deleteImage(id, doc_id, index) {
    // alert(id+"--"+doc_id);
    const doc_obj = {
      _id: id,
      imageId: doc_id
    };
    if (confirm('Are you sure want to delete this image?')) {
      this.loading = true;
      this._appservice.deleteProductImage(doc_obj).subscribe(( Response: any) => {
        this.loading = false;
        if (Response.STATUSCODE === 4002) {
          this._message.showError(Response.message);
          this.ngOnInit();
        } else {
          if (Response.success) {
            this._message.showSuccess(Response.message);
            this.item.image.splice(index, 1);
            this.ngOnInit();
          } else {
            this._message.showWarning(Response.message);
          }
        }
      }, (Error) => {
      });
    }
  }

}
