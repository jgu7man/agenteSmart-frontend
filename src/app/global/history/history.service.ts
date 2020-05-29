import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EventHistoryModel } from './event-historiy.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor (
    private afs: AngularFirestore,
  ) {

   }

  async setEvent(event: EventHistoryModel) {
    if ( !event.body ) event.body = ''
    var colRef = this.afs.collection( event.col ).ref
    var docRef = colRef.doc( event.doc )
    var histRef = docRef.collection( 'historial' )
    var eventAdded = histRef.add( {
      time: new Date(), type: event.type, head: event.head, body: event.body
    } )
    return
  }
}
