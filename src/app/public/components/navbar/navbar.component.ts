import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { UserInterface } from '../../../admin/auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Loading } from '../../../Gdev-Tools/loading/loading.service';
import { take, debounceTime, tap } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {

  user: UserInterface
  view
  onPageChangeSubs$: Subscription

  constructor(
    public auth: AuthService,
    public dashboard: DashboardService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _loading: Loading
  ) { 
    this.getCurrentPage()
  }

  async ngOnInit() {
    this.user = await this.auth.getCurrentUser()
    console.log(this.view);
    this.updatePage()
    
  }

  async getCurrentPage() {
    await this._loading.getCurrentActivatedRoute().pipe(
      take(1))
      .toPromise().then(async route =>{
        this.view = (await route.data.pipe(take(1)).toPromise())['page']})
  }

  updatePage() {
    this.onPageChangeSubs$ =
      this._router.events.subscribe( async ( val ) => {
        if ( val instanceof NavigationEnd ) {
          await this.getCurrentPage()
        }
      } )
    
    
  }

  async ngOnChanges() {
  }

  get initPosition() {
    if (this.view === 'home') {
      if (window.scrollY === 0) {
        return true  
      } else {return false}
    } else {return false}
  }

}
