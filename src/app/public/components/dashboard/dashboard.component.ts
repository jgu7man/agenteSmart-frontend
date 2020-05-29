import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'aSmart-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor (
    public responsive: ResponsiveService
  ) { }

  ngOnInit() {
  }

}
