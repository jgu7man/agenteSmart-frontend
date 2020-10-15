import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DiagramObject, DiagramProps } from '../diagram/diagram-data.interface';
import { DiagramService } from '../diagram/diagram.service';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-mensajes-diagram',
  templateUrl: './mensajes-diagram.component.html',
  styleUrls: ['./mensajes-diagram.component.scss']
})
export class MensajesDiagramComponent implements OnInit {

  windowWidth: number = window.innerWidth
  windowHeight: number = window.innerHeight
  routes: string[] = []

  constructor (
    public diagram_: DiagramService,
  ) { }

  async ngOnInit() {
    this.diagram_.objectList$.subscribe( objectList => {
      objectList.forEach( object => {
        object.anchors.forEach( anchor => {
          this.routes.push(this.setConectionRoute(object, anchor))
        })
      })
    })
  }
  
  

  setConectionRoute( startObject: DiagramObject, anchor: string ) {
    var start: DiagramProps = startObject.props
    var end: DiagramProps = this.diagram_.objectList.find( o => o.id = anchor ).props
    var route: ConectionRoute = {
      start: { x: start.right, y: start.center.y },
      firstCub: { x: start.right + 15, y: start.center.y },
      endCub: { x: end.left - 15, y: end.center.y },
      end: { x: end.left, y:end.center.y },
    }

    
    return `${ route.start.x },${ route.start.y } ${ route.firstCub.x },${ route.firstCub.y } ${ route.endCub.x },${ route.endCub.y } ${ route.end.x },${ route.end.y }`
    
  }



}

interface ConectionRoute {
  start?: { x: number, y: number }
  end?: { x: number, y: number }
  firstCub?: { x: number, y: number }
  endCub?: { x: number, y: number }
}
