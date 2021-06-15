import { Component, OnInit } from '@angular/core';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-recycling-product-scan-message',
  templateUrl: './recycling-product-scan-message.component.html',
  styleUrls: ['./recycling-product-scan-message.component.css']
})
export class RecyclingProductScanMessageComponent implements OnInit {

  search: any = {};
  size: number;
  number: number;
  pagetitle: string;
  edit: boolean;
  isDisabled: boolean = false;
  isloggedin: boolean;
  scanNo: any = [1,10,20,50,75,100];
  item: any = {}
  data: any = [];
  userlist: any;
  admintoken: any;
  category: any;
  productType: any;
  public loading = false;
  constructor(
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent,
    private activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.size = 10;
    this.number = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productType = params['id'];
      
      
      var obj = {
        size: this.size,
        number: this.number,
        productType: this.productType
      }
      this._appservice.listRecyclingProductMsg(obj).subscribe((Response) => {
        if (Response.STATUSCODE == 4002) {
          this._message.showError(Response.message);
          this._app.logoutAdmin();
        } else {
          if (Response.success) {
            var result = Response.response;
            this.data = result;
            
            // if(this.data.length > 0){

            //   this.scanNo.map(item => {

            //     this.data.map(element => {

            //       if(item == element.number){
            //         element.scanNo = element.number;
            //       }

            //     });
            //   });
              
            // } else {
            //   this.scanNo.map(item => {
            //     this.data.push({
            //       "scanNo": item
            //     });
            //   });
            // }
            console.log("this.data",this.data);
            
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
    this.number = this.number + 1
    var obj = {
      size: this.size,
      number: this.number
    }
    this._appservice.listRecyclingProductMsg(obj).subscribe((Response) => {
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
  addNew() {
    this.edit = false
    this.pagetitle = 'Add Message';
    this.item = {}
    this.isDisabled = false;
  }
  getDetails(str: any) {
    this.edit = true;
    this.pagetitle = 'Edit Message';
    this.item = str;
    this.isDisabled = true;
  }
  saveData() {
    this.loading = true;
    var flag = 0, errorMessage;
    if (this.productType == '' || this.productType == undefined) {
      errorMessage = 'Please enter product type';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.item.number == '' || this.item.number == undefined) {
      errorMessage = 'Please enter product scan number';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    if (this.item.message == '' || this.item.message == undefined) {
      errorMessage = 'Please enter product scan message';
      flag = 1;
      this._message.showError(errorMessage)
      return false;
    }
    
    
    
    if (this.edit == false && flag == 0) {
      var obj = {
        productType: this.productType,
        number: this.item.number,
        message: this.item.message
      }
      this._appservice.addRecyclingProductMsg(obj).subscribe((Response) => {
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
      var upobj = {
        _id: this.item._id,
        message: this.item.message
      }
      
      this._appservice.editRecyclingProductMsg(upobj).subscribe((Response) => {
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
      this._appservice.deleteRecyclingProductMsg(item).subscribe((Response) => {
        this.loading = false;
        if (Response.success) {
          this._message.showSuccess(Response.message);
          this.ngOnInit();
        } else {
          this._message.showWarning(Response.message);
        }
      }, (Error) => {
        console.log(Error)
      })
    }
  }
  clear() {
    this.ngOnInit()
  }
  backToPreviousPage(){

    this._router.navigate(['/recyclingProductType']);

 }

}
