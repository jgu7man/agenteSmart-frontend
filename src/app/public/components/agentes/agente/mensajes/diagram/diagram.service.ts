import { Injectable } from '@angular/core';
import { DiagramProps, DiagramObject } from './diagram-data.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinct, distinctUntilKeyChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  objectList: DiagramObject[] = []
  objectList$: BehaviorSubject<DiagramObject[]> = new BehaviorSubject( [])
  object$: Subject<DiagramObject> = new Subject()
  constructor () {
    this.storeObjectsProps()
   }
  
  storeObjectsProps() {
    this.object$.pipe( distinctUntilKeyChanged( 'id' ) )
      .subscribe( object => {
        var objectStored = this.objectList.findIndex( o => o.id == object.id )
        
        object.props.center = {y: 0, x:0}
        object.props.center.y = object.props.top + ( object.props.height / 2 )
        object.props.center.x = object.props.left + ( object.props.width / 2 )
    
        if ( objectStored < 0 ) {
          this.objectList.push( { id: object.id, props: object.props, anchors: object.anchors } )
        } else {
          this.objectList[objectStored].props = object.props
        }
        this.objectList$.next(this.objectList)
    })
  }
}
