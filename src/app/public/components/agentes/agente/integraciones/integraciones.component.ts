import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';



@Component({
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss']
})
export class IntegracionesComponent implements OnInit {

  projectId: string
  copy: Clipboard
  pageAccessToken: string = ''

  
  constructor (
    private _cache: GdevCache,
    private _alert: GdevAlert
  ) {
    this.projectId = this._cache.getDataKey('projectId');
   }

  ngOnInit(): void {
  }

  

}
