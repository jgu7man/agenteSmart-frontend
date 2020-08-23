import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ParametroEntrada } from '../../../../entrada.model';
import { ParametrosService } from '../parametros.service';
import { Loading } from '../../../../../../../../../global/loading/loading.service';

@Component({
  selector: 'aSmart-add-parameter',
  templateUrl: './add-parameter.component.html',
  styleUrls: ['./add-parameter.component.scss']
})
export class AddParameterComponent implements OnInit {

  param: ParametroEntrada
  @ViewChild( 'displayName' ) displayName: ElementRef
  @Output() public closeRow = new EventEmitter<boolean>()

  constructor (
    public paramsService: ParametrosService,
    private loading: Loading
  ) { }

  async ngOnInit() {
    this.param = {
      displayName: '',
      entityTypeDisplayName: '',
      value: '',
      mandatory: false,
      isList: false
    }
    await this.loading.waitFor(200)
    this.displayName.nativeElement.focus()
  }


  onTipoChanged(tipo) {
    this.param.entityTypeDisplayName = tipo
  }

  onValueSelected( value ) {
    this.param.value = value
  }

}
