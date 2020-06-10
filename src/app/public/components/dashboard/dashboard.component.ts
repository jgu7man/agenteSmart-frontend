import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { NAVLINK } from '../navbar/navlink.interface';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'aSmart-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  mobileNavbar: NAVLINK[]
  constructor (
    public responsive: ResponsiveService,
    private dashboard: DashboardService
  ) { }

  ngOnInit() {
    
    this.dashboard._setMobileNavBar.subscribe( result => {
      this.mobileNavbar = result
    })
  }



}
