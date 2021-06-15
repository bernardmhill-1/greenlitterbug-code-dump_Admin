import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from '../../../config';
import { HighlightPipe } from '../highlight.pipe';


@Component({
  selector: 'app-cause',
  templateUrl: './cause.component.html',
  styleUrls: ['./cause.component.css']
})
export class CauseComponent implements OnInit {
  search: any = {};
  size: number;
  number: number;
  pagetitle: string;
  edit: boolean;
  userdet: boolean;
  isloggedin: boolean;
  dobyear: any[];
  item: any = {};
  data: any = [];
  userlist: any;
  admintoken: any;
  category: any;
  uploadfile: any = [];
  privewfile: any = [];
  file2: any;
  urls = [];
  image_type = ['image/gif', 'image/jpeg', 'image/png', 'image/gif'];
  file_type = ['application/pdf', 'application/msword', 'application/doc', 'application/ms-doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  docfile: any;
  public loading = false;

  constructor(
    private http: Http,
    private _appservice: UserService,
    private _message: MessageService,
    private _app: AppComponent) {
  }

  onSelectImageFile(event) {
    const total_file_count = event.target.files.length;
    if (total_file_count > 0) {
      let count = 0;
      for (let f = 0; f < total_file_count; f++) {
        this.uploadfile[f] = event.target.files[f];
        if (this.image_type.includes(this.uploadfile[f].type)) {
          if (event.target.files && event.target.files[f]) {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.privewfile[count] = event.target['result'];
              count++;
            };
            reader.readAsDataURL(event.target.files[f]);
          }
        } else {
          this._message.showError('Please enter valid image file');
          return false;
        }
      }
    }
  }

  onSelectDocFile(event) {
    let uploadDocFile = event.target.files;
    uploadDocFile = event.target.files[0];
    if (this.file_type.includes(uploadDocFile.type)) {
      this.docfile = event.target.files[0];
    } else {
      this._message.showError('Please upload doc or pdf file');
      return false;
    }
  }
  addNew() {
    this.edit = false;
    this.pagetitle = 'Add Cause';
    this.item = {};
    this.uploadfile = [];
    this.privewfile = [];
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }
  editC() {
    this.edit = true;
    this.pagetitle = 'Edit Cause';
    this.uploadfile = [];
    this.privewfile = [];
    (document.getElementById('imageFile')as HTMLInputElement).value = null;
  }

  saveData() {
    let flag = 0, errorMessage, isSplChar_name, re;
    re = /^([a-zA-Z ]+)$/;
    isSplChar_name = !re.test(this.item.description);
    if (this.item.title === '' || this.item.title === undefined) {
      errorMessage = 'Please enter title';
      this._message.showError(errorMessage);
      return false;
    } else if (this.item.description === '' || this.item.description === undefined) {
      errorMessage = 'Please enter description';
      this._message.showError(errorMessage);
      return false;
    } else if (this.uploadfile.length === 0 && !this.edit) {
      errorMessage = 'Please upload image';
      this._message.showError(errorMessage);
      return false;
    } else {
      if (this.edit === false) {
        //alert('add working')
        this.loading = true;
        this._appservice.addCause(this.item, this.uploadfile).subscribe((Response) => {
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
      } else {
        this.loading = true;
        this._appservice.editCause(this.item, this.uploadfile).subscribe((Response) => {
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

  uploadData() {
    let flag = 0, errorMessage;
    if (this.item.doctitle === '' || this.item.doctitle === undefined) {
      errorMessage = 'Please enter document title';
      this._message.showError(errorMessage);
      return false;
    } else if (this.docfile === '' || this.docfile === undefined) {
      errorMessage = 'Please upload document file';
      this._message.showError(errorMessage);
      return false;
    } else {
      this.loading = true;
      this._appservice.uploadDocCause(this.item, this.docfile).subscribe((Response) => {
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

  ngOnInit() {
    this.size = 10;
    this.number = 0;
    const obj = {
      size: this.size,
      number: this.number
    };
    this._appservice.listCause(obj).subscribe((Response) => {
      if (Response.STATUSCODE === 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          const result = Response.response;
          this.data = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    });
  }

  loadmore() {
    this.loading = true;
    this.number = this.number + 1;
    this.admintoken = localStorage.getItem('admintoken');
    const obj = {
      size: this.size,
      number: this.number
    };
    this._appservice.listCause(obj).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE === 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          const result = Response.response;
          this.data = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    });
  }

  uploadDoc(item) {
    this.edit = false;
    this.pagetitle = 'Upload Document for ' + item.title;
    this.item = item;
  }

  viwData(item) {
    this.loading = true;
    this.edit = false;
    this.pagetitle = 'View Cause Detail ';
    this._appservice.DetailCause(item).subscribe((Response) => {
      this.loading = false;
      if (Response.STATUSCODE === 4002) {
        this._message.showError(Response.message);
        this._app.logoutAdmin();
      } else {
        if (Response.success) {
          const result = Response.response;
          this.item = result;
        } else {
          this._message.showWarning(Response.message);
        }
      }
    }, (Error) => {
    });
  }

  deleteData(item) {
    if (confirm('Are you sure want to delete this data?')) {
      this.loading = true;
      this._appservice.deleteCause(item).subscribe((Response) => {
        this.loading = false;
        if (Response.STATUSCODE === 4002) {
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
      });
    }
  }
  // Delete Document
  deleteDocument(id, doc_id, index) {
    // alert(id+"--"+doc_id);
    const doc_obj = {
      _id: id,
      docId: doc_id
    };
    if (confirm('Are you sure want to delete this data?')) {
      this.loading = true;
      this._appservice.deleteCauseDocument(doc_obj).subscribe(( Response: any) => {
        this.loading = false;
        if (Response.STATUSCODE === 4002) {
          this._message.showError(Response.message);
          this.ngOnInit();
        } else {
          if (Response.success) {
            this._message.showSuccess(Response.message);
            this.item.document.splice(index, 1);
            this.ngOnInit();
          } else {
            this._message.showWarning(Response.message);
          }
        }
      }, (Error) => {
      });
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
      this._appservice.deleteCauseImage(doc_obj).subscribe(( Response: any) => {
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
