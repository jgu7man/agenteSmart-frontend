import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConversacionesService {

    projectId: string
    userId: string
    conversationsPath: string


    constructor (
        private _cache: CacheService,
        private _alert: AlertService,
        private _fs: AngularFirestore
    ) {
        this.projectId = this._cache.getDataKey( 'projectId' )
        this.userId = this._cache.getDataKey( 'user' )[ 'uid' ]
        this.conversationsPath = `usuarios/${ this.userId }/agentes/${ this.projectId }/integraciones/`
   }
}
