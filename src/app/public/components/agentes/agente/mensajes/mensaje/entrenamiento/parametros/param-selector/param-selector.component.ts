import { Subscription } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ParametrosService } from '../parametros.service';
import { RespuestasService } from '../../respuestas/respuestas.service';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import { GdevLoading } from '../../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { CurrentMensajeService } from '../../../current-mensaje.service';
import { ParametroMensaje } from '../../../../mensaje.model';

@Component({
    selector: 'aSmart-param-selector',
    templateUrl: './param-selector.component.html',
    styleUrls: ['./param-selector.component.scss'],
})
export class ParamSelectorComponent implements OnInit, AfterViewInit, OnDestroy{


    @Input() paramSelected: ParamSelected
    @Input() focused: boolean = false;
    @ViewChild('paramSelector') public selector: MatSelect;
    tipoSelected;
    isOriginal
  @Output() onParamaSelected: EventEmitter<ParamSelected> = new EventEmitter();
  paramList: ParametroMensaje[]
  paramsSubscription: Subscription

    constructor(
        private _params: ParametrosService,
        private _loading: GdevLoading,
      public respuestas_: RespuestasService,
        private _mensaje: CurrentMensajeService
    ) {
      this.paramsSubscription
      this._mensaje.current$.subscribe(({ parameters }) => {
        this.paramList = parameters
      })
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        this._loading.waitFor(1000)
        if ( this.focused ) this.selector.open();
    }

    async onOpenedChange(toggle: boolean) {
        // if (!toggle) {
        //     await this._loading.waitFor(500)
        //     console.log(this.paramSelected);
        //     this.onParamaSelected.emit({
        //         value: this.paramSelected.value,
        //         isOriginal: this.isOriginal,
        //     });
        // }
    }


    onParamChange(selected: MatSelectChange) {
        if (!this.paramSelected) this.paramSelected = {value: '', isOriginal: false}
        this.paramSelected.value = selected.value
        if (this.paramSelected) {
            let paramFound = this._params.getParamByName(this.paramSelected.value)
            if (paramFound) {
                let value = paramFound.value
                ? paramFound.value
                : paramFound.displayName;

                this.paramSelected.value = value
                this.isOriginal = value.split('.').length > 1 ? true : false;
            } else {
                this.paramSelected.value = `$${this.paramSelected}`
                this.isOriginal = true
            }

            this.paramSelected.isOriginal = this.isOriginal
            this.onParamaSelected.emit(this.paramSelected)
        }

  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe()
  }

}


export interface ParamSelected {
    value: string,
    isOriginal?: boolean
}
