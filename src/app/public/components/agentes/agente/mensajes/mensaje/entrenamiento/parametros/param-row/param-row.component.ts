import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ParametroMensaje } from '../../../../mensaje.model';
import { ParametrosService } from '../parametros.service';
import { Loading } from '../../../../../../../../../Gdev-Tools/loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'aSmart-param-row',
  templateUrl: './param-row.component.html',
  styleUrls: ['./param-row.component.scss']
})
export class ParamRowComponent implements OnInit {


  @Input() param: ParametroMensaje
  switchNameInput: boolean = false
  switchTipoSelecter: boolean = false
  prevDisplayName: string
  @ViewChild( 'displayName' ) displayNameInput: ElementRef

  constructor (
    public params_: ParametrosService,
    private loading: Loading
  ) { }

  ngOnInit(): void {
  }

  onValueSelected( value ) {
    this.param.value = value
    this.params_.updateParam(this.param)
  }

  async toEditDisplayName() {
    this.switchNameInput = true
    this.prevDisplayName = this.param.displayName
    await this.loading.waitFor( 100 )
    this.displayNameInput.nativeElement.focus()
  }

  toEditTipo() {
    this.switchTipoSelecter = true
  }

  onDisplayNameChanged(event) {
    event.stopImmediatePropagation()
    if(this.param.displayName != this.prevDisplayName)
    this.params_.updateParam(this.param)
  }

  onTipoChanged(tipo) {
    this.param.entityTypeDisplayName = tipo
    this.params_.updateParam(this.param)
  }


  onMandatoryChange(event: MatCheckboxChange) {
    this.param.mandatory = event.checked
    this.params_.updateParam(this.param)
  }

  onIslistChange(event: MatCheckboxChange) {
    this.param.isList = event.checked
    this.params_.updateParam(this.param)
  }

  onDeleteParam() {
    this.params_.deleteParam(this.param)
  }


}
