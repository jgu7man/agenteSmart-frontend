import { Component, OnInit, Input } from '@angular/core';
import { IntentModel } from '../../../mensaje.model';
import { CacheService } from '../../../../../../../../Gdev-Tools/gdev-cache/cache.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'aSmart-breadcums',
  templateUrl: './breadcums.component.html',
  styleUrls: ['./breadcums.component.scss']
})
export class BreadcumsComponent implements OnInit {

  mensajes: IntentModel[]
  contexto
  @Input() intentIndex
  constructor (
    private _cache: CacheService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
  }
  
  async ngOnInit() {
    this.contexto = this._route.snapshot.queryParamMap.get('contexto')
    this.mensajes = await this._cache.getDataKey( 'mensajesList:' + this.contexto )
  }


}
