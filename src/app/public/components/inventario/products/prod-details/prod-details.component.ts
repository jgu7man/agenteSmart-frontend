import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProdDetalle } from '../product.model';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';

@Component({
  selector: 'gdev-prod-details',
  templateUrl: './prod-details.component.html',
  styleUrls: ['./prod-details.component.scss']
})
export class ProdDetailsComponent implements OnInit {

  newDetail: ProdDetalle = {
    detailName: '',
    detailValue: ''
  }

  @Input() details: ProdDetalle[] = []
  @Output() detailsChanged: EventEmitter<ProdDetalle[]> = new EventEmitter()

  constructor (
    private _alert: GdevAlert
  ) { }

  ngOnInit(): void {
  }

  addCaract() {
    let detailStored = this.details.findIndex( d => d.detailName == this.newDetail.detailName )
    if ( detailStored < 0 ) {
      let isNumber = parseInt( this.newDetail.detailValue )
      console.log(this.newDetail.detailValue)
      console.log( !isNaN( this.newDetail.detailValue ));
      if ( !isNaN(this.newDetail.detailValue) ) this.newDetail.detailValue = isNumber
      console.log(this.newDetail);
      this.details.push( this.newDetail )
      this.detailsChanged.emit( this.details )
    } else {
      this._alert.sendMessageAlert('Esta característica ya existe, si deseas cambiarla, borra la actual y créala de nuevo')
    }
  }

  deleteCaract(detail) {
    let detailStored = this.details.findIndex( d => d.detailName == detail)
    this.details.splice( detailStored, 1 )
    this.detailsChanged.emit(this.details)
  }

}
