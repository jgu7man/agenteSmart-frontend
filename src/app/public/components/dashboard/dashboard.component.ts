import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { DashboardService } from './dashboard.service';
import { ChatService } from '../../../chat/components/chat.service';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { Title } from '@angular/platform-browser';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'aSmart-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy{
  /** Almacena el valor de la sección y define si se habilita el ChatTester */
  public section: string = '';
  public page: string = ''
  private sidenavSubs?: Subscription
  private routeDataSubs?: Subscription
  @ViewChild('sidenav') private sidenav?: MatDrawer
  private inisializationSubs?: Subscription

  constructor(
    public responsive_: ResponsiveService,
    public dashboard_: DashboardService,
    public chat_: ChatService,
    private _loading: GdevLoading,
    private _title: Title
  ) {
    this.setTitles()
    this.listenNavbarToggle()
    this.inisializationSubs = this.dashboard_.initializeDashboard()
  }

  ngOnInit() {}

  // # SET TITLE
  /** Toma los datos de las rutas y define títulos de la página */
  setTitles() {
    this.routeDataSubs =this._loading.collectRouteData()
      .subscribe((routeData) => {
        var section = routeData.data['section'];
        var page = routeData.data['page'];
        this._title.setTitle(`${page}${section ? ' - ' + section : ''}`);
        this.section = section;
      });
  }


  // # LISTEN NAVBAR TOGGLE
  /** Escucha los llamados para abrir o cerrar el Sidenav */
  listenNavbarToggle() {
     this.sidenavSubs = this.dashboard_.toggleSidenav$
      .subscribe(() => { this.sidenav.toggle() })
  }

  ngOnDestroy() {
    if (this.sidenavSubs) this.sidenavSubs.unsubscribe()
    if (this.routeDataSubs) this.routeDataSubs.unsubscribe()
    if (this.inisializationSubs) this.inisializationSubs.unsubscribe()
  }

}
