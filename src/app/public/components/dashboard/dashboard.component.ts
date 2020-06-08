import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'aSmart-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  windowHeight
  constructor (
    public responsive: ResponsiveService
  ) { }

  ngOnInit() {
    this.windowHeight = window.innerHeight -64
  }



}
