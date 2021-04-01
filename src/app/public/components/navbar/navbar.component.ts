import {
    Component,
    OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { UserInterface } from '../../../admin/auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GdevLoading } from '../../../gdev-tools/src/lib/loading/loading.service';
import { Subscription } from 'rxjs';
import { GdevCache } from 'src/app/gdev-tools/src/public-api';

@Component({
  selector: 'aSmart-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  /** Almacena y valida el usuario autenticado*/
  public user?: UserInterface;
  /** Almacena la vista pública y define la vista de la aplicación */
  public view?: string
  /** Observa los cambios en la página */
  private onPageChangeSubs$?: Subscription;

  constructor(
    public auth_: AuthService,
    public dashboard: DashboardService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _loading: GdevLoading,
    private _cache: GdevCache
  ) {
    // NOTE Carga por primera y unica vez el usuario
    this.auth_.user$.subscribe((user) => {
        this._cache.updateData('user', user);
    });
    this.getCurrentPage();
    this._loading.getCurrentActivatedRoute().subscribe(() => {
      this._loading.collectRouteData().subscribe((data) => {
        this.view = data.data['page'];
        console.log( this.view )
      });
    })
  }


  async ngOnInit() {
    this.user = await this._cache.getAsyncKey<UserInterface>('user');
    // this.updatePage();
  }

  async getCurrentPage() {
    this._loading.collectRouteData().subscribe((data) => {
      this.view = data.data['page'];
    });
  }

  // REVIEW No usarla no genera errores?
  private _updatePage() {
    this.onPageChangeSubs$ = this._router.events.subscribe(async (val) => {
      if (val instanceof NavigationEnd) {
        await this.getCurrentPage();
      }
    });
  }


  get initPosition() {
    if (this.view === 'home') {
      if (window.scrollY === 0) {
          return true;
      } else {
          return false;
      }
    } else {
      return false;
    }
  }
}
