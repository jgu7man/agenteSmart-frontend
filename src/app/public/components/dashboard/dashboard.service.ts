import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NAVLINK } from '../navbar/navlink.interface';

@Injectable({providedIn: 'root'})
export class DashboardService {
    
    
    _setMobileNavBar: Subject<NAVLINK[]> = new Subject()

    constructor () { }
    
    setMobileNavbar(navbar: NAVLINK[]) {
        return this._setMobileNavBar.next(navbar)
    }

}


