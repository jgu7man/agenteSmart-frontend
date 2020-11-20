import { CardButton } from './../../../respuestasIntent.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { RespuestaCard, RespuestaCardButton } from '../../../respuesta.model';
import { CurrentAgenteService } from '../../../../../../../current-agente.service';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { TarjetaModel } from '../../../../../../../../../tarjetas/tarjeta.model';

@Component({
  selector: 'aSmart-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  botones: CardButton[] = []

  card: TarjetaModel = {name:''}
  private _Card : BehaviorSubject<TarjetaModel> = new BehaviorSubject(this.card);
  @Input() set Card(card: TarjetaModel) { this._Card.next(card); }
  get Card() { return this._Card.getValue()}

  
  @Output() cardSelected = new EventEmitter<TarjetaModel>();
  constructor (
    public agenteS: CurrentAgenteService
  ) { }

  ngOnInit(): void {
    this._Card.pipe(
      distinctUntilKeyChanged('name')
    ).subscribe( card => {
      this.card = card
    } )
  }

  emitCard( change: MatSelectChange ) {
    let tarjetaSelected = this.agenteS.tarjetasList.find( t => t.name == change.value )
    console.log(tarjetaSelected);
    this.cardSelected.emit(tarjetaSelected)
  }

}
