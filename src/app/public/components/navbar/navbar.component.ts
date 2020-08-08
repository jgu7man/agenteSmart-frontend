import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { UserInterface } from '../../../admin/auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'aSmart-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: UserInterface
  constructor(
    public auth: AuthService,
    public dashboard: DashboardService
  ) { }

  async ngOnInit() {
    this.user = await this.auth.getCurrentUser()
    
  }

}
