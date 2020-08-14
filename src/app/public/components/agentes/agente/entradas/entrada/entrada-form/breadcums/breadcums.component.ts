import { Component, OnInit, Input } from '@angular/core';
import { EntradaModel } from '../../../entrada.model';
import { CacheService } from '../../../../../../../../global/cache/cache.service';
import { EntradasService } from '../../../entradas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'aSmart-breadcums',
  templateUrl: './breadcums.component.html',
  styleUrls: ['./breadcums.component.scss']
})
export class BreadcumsComponent implements OnInit {

  entradas: EntradaModel[]
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
    this.entradas = await this._cache.getDataKey( 'entradasList:' + this.contexto )
    console.log( 'entrada index: ', this.intentIndex);
  }


}
