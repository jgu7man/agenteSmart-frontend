import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'aSmart-messenger-int',
  templateUrl: './messenger-int.component.html',
  styleUrls: ['./messenger-int.component.scss']
})
export class MessengerIntComponent implements OnInit {

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

  copyMessenger( field: 'URL' | 'ID' ) {
    
    this.copy.copy( field === 'URL'
      ? `https://api.agentesmart.com/messenger/${ this.projectId }`
      : this.projectId
    )
    this._alert.sendFloatNotification('Copiado')
  }

}
