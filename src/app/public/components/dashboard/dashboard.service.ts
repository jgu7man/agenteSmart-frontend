import { of, Subscription } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { AgentesService } from '../agentes/agentes.service';
import { GdevStoreProductsService } from '../inventario/products/products.service';
import { iNavlink } from '../navbar/navlink.interface';
import { GdevCache } from 'src/app/gdev-tools/src/public-api';
import { UserInterface } from 'src/app/admin/auth/auth.service';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, flatMap, map, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DashboardService {

  /** Almacena la lista de links para el navbar movil */
  public mobileNavbar$: Subject<iNavlink[]> = new Subject()
  /** Emite eventos para activar el menu mobile */
  public toggleMobileMenu: EventEmitter<boolean> = new EventEmitter()
  /** Emite eventos para activaar o desactivar sidenav en la versión mobile */
  public toggleSidenav$: EventEmitter<null> = new EventEmitter()


  constructor(
    private _agentes: AgentesService,
    private _products: GdevStoreProductsService,
    private _cache: GdevCache
  ) {

   }

  initializeDashboard() {
    return this._cache.listenForChanges
      <UserInterface>('user').pipe(
        // tap(console.log),
        filter(user => !!user),
        flatMap(user => this._agentes.listenAgentes(user.uid)),
        distinctUntilChanged((x, y) => x.length === y.length)
        // Another flatMap as you like
      )
  }


  // # SET MOBILE NAVBAR
  /** Define los links para el navbar mobile */
  setMobileNavbar(navbar: iNavlink[]) {
    return this.mobileNavbar$.next(navbar)
  }

  // # SWITCH MOBILE MENU
  /** Activador de menu mobile */
  switchMobileMenu() {
    this.toggleMobileMenu.emit(true)
  }

}


