import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { UserInterface } from '../../../admin/auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from '../../../Gdev-Tools/loading/loading.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aSmart-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: UserInterface
  view
  constructor(
    public auth: AuthService,
    public dashboard: DashboardService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _loading: Loading
  ) { 
    this._loading.getCurrentActivatedRoute().pipe(take(1))
      .toPromise().then(async route =>
        this.view = (await route.data.pipe(take(1)).toPromise())['page'])
    
  }

  async ngOnInit() {
    this.user = await this.auth.getCurrentUser()
    console.log(this.view);
  }

}
