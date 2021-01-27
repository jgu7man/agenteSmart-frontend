import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';



@Component({
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss']
})
export class IntegracionesComponent implements OnInit {

  projectId: string
  copy: Clipboard
  pageAccessToken: string = ''

  
  constructor (
    private _cache: CacheService,
    private _alert: AlertService
  ) {
    this.projectId = this._cache.getDataKey('projectId');
   }

  ngOnInit(): void {
  }

  

}
