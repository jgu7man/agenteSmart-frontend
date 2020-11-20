import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CondicionalModel, SimpleModel } from '../../../respuesta.model';
import { ParametrosService } from '../../../../parametros/parametros.service';
import { TipoEntidadModel } from '../../../../../../../tipos/tipo.model';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
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
        this.result = new CondicionalModel('', '', '', '');
    }

    async ngOnInit() {}

    

    onParamChange(selected: ParamSelected) {
        
        this.result.parametro = selected.value;
        this.tipoSelected = this.respuestas_.mensajeTypeEntities.find(
            (t) => t.displayName == selected.value
        );
        console.log(this.tipoSelected);
        this.isOriginal = selected.isOriginal

        this.onRespChanges.emit(this.result);
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
