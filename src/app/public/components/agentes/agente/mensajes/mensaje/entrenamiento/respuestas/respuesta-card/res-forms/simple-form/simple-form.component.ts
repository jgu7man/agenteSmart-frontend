import { RespuestaCard, Suggest } from '../../../respuestasIntent.model';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { SimpleModel, Sugerencia } from '../../../respuesta.model';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'aSmart-simple',
    templateUrl: './simple-form.component.html',
    styleUrls: ['./simple-form.component.scss'],
})
export class SimpleFormComponent implements OnInit {
    @Input() result: SimpleModel;

    @Output() onRespChanges: EventEmitter<SimpleModel> = new EventEmitter();
    @Output() toggleSugerencias: EventEmitter<boolean> = new EventEmitter()

    switchSuggestions: boolean = false;

    constructor(public resService: RespuestasService) {
        this.result = new SimpleModel('', []);
    }

    ngOnInit(): void {
        if (this.result.suggestions.length > 0) {
            this.switchSuggestions = true
        }
    }

    toggleSuggestions(change: MatSlideToggleChange) {
        this.switchSuggestions = change.checked;
        this.toggleSugerencias.emit(change.checked)
    }

    catchText(text: string) {
        this.result.text = text
        this.onRespChanges.emit(this.result);
    }

    catchSugerencias(sugerencias: Sugerencia[]) {
        this.result.suggestions = sugerencias
        console.log( this.result.suggestions )
        this.onRespChanges.emit(this.result);
    }
}
