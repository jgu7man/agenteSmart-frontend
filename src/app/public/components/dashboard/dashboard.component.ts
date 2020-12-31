import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { NAVLINK } from '../navbar/navlink.interface';
import { DashboardService } from './dashboard.service';
import { MatDrawer } from '@angular/material/sidenav';
import { CacheService } from '../../../gdev-tools/cache/cache.service';
import { ChatService } from '../../../chat/components/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';

@Component({
  selector: 'aSmart-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  mobileNavbar: NAVLINK[]
  toggleSideNav
  projectId: string
  section: string

  backdrop: boolean
  constructor (
    public responsive: ResponsiveService,
    public dashboard: DashboardService,
    private _cache: CacheService,
    public chat_: ChatService,
    private _loading: Loading
  ) {
    this._loading.collectRouteData().subscribe( routeData => {
      this.section = routeData.data['section']
    })
   }

  ngOnInit() {
   this.toggleMenuMobile()
    this.dashboard._setMobileNavBar.subscribe( result => {
      this.mobileNavbar = result
    } )
    this.getCurrentAgente()
  }

  async getCurrentAgente() {
    this.projectId = await this._cache.getDataKey('projectId')
  }

  toggleMenuMobile() {
    this.dashboard.toggleMobileMenu.subscribe( ( toggle: boolean ) => {
      this.toggleSideNav = !this.toggleSideNav
    })
  }



}
