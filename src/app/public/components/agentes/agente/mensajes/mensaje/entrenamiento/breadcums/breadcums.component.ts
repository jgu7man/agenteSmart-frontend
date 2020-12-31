import { Component, OnInit, Input } from '@angular/core';
import { IntentModel } from '../../../mensaje.model';
import { CacheService } from '../../../../../../../../gdev-tools/cache/cache.service';
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
  ) {
  }
  
  async ngOnInit() {
    this.contexto = this._route.snapshot.queryParamMap.get( 'contexto' )
    if ( this.contexto )
      this.mensajes = await ( await this._cache.getDataKey( 'contextosLists' ) )[ this.contexto ];
  }


}
