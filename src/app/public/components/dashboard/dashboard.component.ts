import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { NAVLINK } from '../navbar/navlink.interface';
import { DashboardService } from './dashboard.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'aSmart-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  mobileNavbar: NAVLINK[]
  toggleSideNav
  constructor (
    public responsive: ResponsiveService,
    public dashboard: DashboardService
  ) { }

  ngOnInit() {
   this.toggleMenuMobile()
    this.dashboard._setMobileNavBar.subscribe( result => {
      this.mobileNavbar = result
    })
  }

  toggleMenuMobile() {
    this.dashboard.toggleMobileMenu.subscribe( ( toggle: boolean ) => {
      this.toggleSideNav = !this.toggleSideNav
    })
  }



}
