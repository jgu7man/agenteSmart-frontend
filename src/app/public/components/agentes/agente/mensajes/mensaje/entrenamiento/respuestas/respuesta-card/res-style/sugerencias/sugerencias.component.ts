import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
    Input,
} from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Sugerencia } from '../../../respuesta.model';
import { GdevAlert } from '../../../../../../../../../../../gdev-tools/src/lib/alert/alert.service';
import { GdevLoading } from '../../../../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { ContextSelected } from '../../../../../../../contextos/contexto-selector/contexto-selector.component';

@Component({
    selector: 'aSmart-sugerencias',
    templateUrl: './sugerencias.component.html',
    styleUrls: ['./sugerencias.component.scss'],
})
export class SugerenciasComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    newSuggest: Sugerencia = { text: '', context: '' };

    @Input() sugerencias: Sugerencia[] = [];
    @Output() onSugerenciasChange: EventEmitter<Sugerencia[]> = new EventEmitter();

    constructor (
        private _alert: GdevAlert,
        private _loading: GdevLoading
    ) { }

    ngOnInit(): void {}

    onCatchTextMsg(text) {
        this.sugerencias.push(this.newSuggest);
        this.newSuggest = { text: '', context: undefined };
        console.log(this.sugerencias);
        this.onSugerenciasChange.emit(this.sugerencias);
    }

    addText(): void {
        if (!this.sugerencias) this.sugerencias = [];
        if (!this.newSuggest.context) {
            delete this.newSuggest.context
        }
        this.sugerencias.push(this.newSuggest);
        this.newSuggest = { text: '', context: undefined };
        this.onSugerenciasChange.emit(this.sugerencias);
    }
    async addContext(selected: ContextSelected) {
        if (this.newSuggest.text) {
            if (!this.sugerencias) this.sugerencias = [];
            this.newSuggest.context = selected.context
            this.sugerencias.push(this.newSuggest);
            await this._loading.waitFor(100)

            console.log( this.sugerencias )
            this.onSugerenciasChange.emit(this.sugerencias);
            this.newSuggest = { text: '', context: undefined };
        }
    }
    onEdit(suggest: Sugerencia, index: number) {
        if (this.newSuggest.context != '' || this.newSuggest.text != '') {
            this.remove(index);
            this.newSuggest = suggest;
        } else {
            this._alert.sendMessageAlert(
                'Tienes una sugerencia pendiente de agregar'
            );
        }
    }

    remove(index: number): void {
        if (index >= 0) {
            this.sugerencias.splice(index, 1);
            this.onSugerenciasChange.emit(this.sugerencias);
        }
    }
}

export interface SugerenciasResult {
    value: Sugerencia[],
    activated: boolean
}
