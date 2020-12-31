import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ParametrosService } from '../parametros.service';
import { RespuestasService } from '../../respuestas/respuestas.service';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import { Loading } from '../../../../../../../../../gdev-tools/loading/loading.service';

@Component({
    selector: 'aSmart-param-selector',
    templateUrl: './param-selector.component.html',
    styleUrls: ['./param-selector.component.scss'],
})
export class ParamSelectorComponent implements OnInit, AfterViewInit {
    
    
    @Input() paramSelected: string;
    @Input() focused: boolean = false;
    @ViewChild('paramSelector') public selector: MatSelect;
    tipoSelected;
    isOriginal
    @Output() onParamaSelected: EventEmitter<ParamSelected> = new EventEmitter();

    constructor(
        private _params: ParametrosService,
        private _loading: Loading,
        public respuestas_: RespuestasService,
    ) {}

    ngOnInit(): void {

    }
    
    ngAfterViewInit() {
        this._loading.waitFor(1000)
        if ( this.focused ) this.selector.open();
        console.log( this.respuestas_.paramList )
        console.log( this.paramSelected )
    }

    async onOpenedChange(toggle: boolean) {
        if (!toggle) {
            await this._loading.waitFor(500)
            console.log(this.paramSelected);
            this.onParamaSelected.emit({
                value: this.paramSelected,
                isOriginal: this.isOriginal,
            });
        } 
    }


    onParamChange(selected: MatSelectChange) {
        this.paramSelected = selected.value
        console.log( this.paramSelected );
        if (this.paramSelected) {
            let value = this._params.getParamByName(this.paramSelected).value
                    ? this._params.getParamByName(this.paramSelected).value
                    : this._params.getParamByName(this.paramSelected).displayName;
                    
            this.paramSelected = value        
            this.isOriginal = value.split('.').length > 1 ? true : false;
            
        }
        
    }
    
}


export interface ParamSelected {
    value: string,
    isOriginal?: boolean
}
