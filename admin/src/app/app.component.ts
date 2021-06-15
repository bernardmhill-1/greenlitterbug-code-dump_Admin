import { Component, ViewContainerRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
//import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute, Params} } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { EventEmitter, Output ,Input,OnDestroy} from '@angular/core';
import {Broadcaster} from './broadcaster';
import {Observable} from 'rxjs/Rx'

//import 'rxjs/add/operator/filter';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent  {
 
    childTitle:string = 'This text is passed to child';

  @Input()
  isLogin: any = null;
  currentpath: any = null;
  isloggedin: any = null;
  returnUrl: string;

  constructor(public router: Router, public state: ActivatedRoute, private broadcaster: Broadcaster,
    private toastr: ToastrService, vRef: ViewContainerRef,
    private location: Location) {
      
  }
  ngOnInit() {    
    var tokenchk = localStorage.getItem("admintoken");    
    if (tokenchk == null) {      
        this.isLogin = false;
        this.router.navigate(['/login']);
      } else {
        this.isLogin = true ;
    }
  }

  logoutAdmin() {
    this.isLogin = false;    
    localStorage.clear();
    this.router.navigate(['/login']);
  }

 onNotify($event){
      this.isLogin = true

 }
}
