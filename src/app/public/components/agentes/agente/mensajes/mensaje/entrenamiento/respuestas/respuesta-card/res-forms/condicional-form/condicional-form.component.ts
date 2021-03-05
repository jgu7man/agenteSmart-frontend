import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CondicionalModel, SimpleModel } from '../../../respuesta.model';
import { ParametrosService } from '../../../../parametros/parametros.service';
import { TipoEntidadModel } from '../../../../../../../tipos/tipo.model';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import {ParamSelected} from '../../../../parametros/param-selector/param-selector.component';

@Component({
    selector: 'aSmart-condicional-form',
    templateUrl: './condicional-form.component.html',
    styleUrls: ['./condicional-form.component.scss'],
})
export class CondicionalFormComponent implements OnInit {
    paramSelected: string = '';
    isOriginal: boolean = true;
    tipoSelected: TipoEntidadModel;

    @Input() result: CondicionalModel;
    @Output() onRespChanges: EventEmitter<
        CondicionalModel
    > = new EventEmitter();

    condicionesList: Condition[] = [
        { displayText: 'igual a', operator: 'igual' },
        { displayText: 'diferente a ', operator: 'diferente' },
        { displayText: 'mayor que', operator: 'mayor' },
        { displayText: 'menor que ', operator: 'menor' },
        { displayText: 'mayor o igual que', operator: 'mayor_igual' },
        { displayText: 'menor o igual que', operator: 'meno_igual' },
        { displayText: 'existe', operator: 'existe' },
        { displayText: 'no existe', operator: 'no_existe' },
    ];

    constructor(
        public respuestas_: RespuestasService,
        public _params: ParametrosService
    ) {
        this.result = new CondicionalModel('', '', '', );
    }

    async ngOnInit() {
    }

    disableValue() {
        return  this.result.condicion == 'existe' || this.result.condicion == 'no_existe'  || !this.result.condicion

    }

    setParameter() {
        if ( this.result.parametro ) {
            return this.result.parametro.split('$').length >= 2 ?
                this.result.parametro.split('$')[1].split('.')[0] :
                this.result.parametro.split('$')[0]
        }
    }

    onParamChange(selected: ParamSelected) {

        this.isOriginal = selected.isOriginal
        this.result.parametro = selected.value;
        this.tipoSelected = this.respuestas_.mensajeTypeEntities.find(
            (t) =>{ t.displayName == selected.value}
        );

        this.onRespChanges.emit(this.result);
    }

    validateOriginal() {
        return !this.isOriginal && this.tipoSelected
    }

    async catchresult(msg: SimpleModel) {
        this.result.text = msg.text;
        // await this.loading.waitFor(100)
        this.onRespChanges.emit(this.result);
    }
}

export interface Condition {
    displayText: string;
    operator: string;
}
