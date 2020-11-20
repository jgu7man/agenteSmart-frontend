import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { pluck, startWith, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ParamSelected } from '../../../../parametros/param-selector/param-selector.component';

@Component({
    selector: 'aSmart-respuesta-text',
    templateUrl: './respuesta-text.component.html',
    styleUrls: ['./respuesta-text.component.scss'],
})
export class RespuestaTextComponent implements AfterViewInit, OnDestroy {
    
    @Input() text: string;
    textSub: Subscription;
    selectParameter: boolean = false
    paramSelected: string
    @ViewChild('dialgbox') mensajeInput: ElementRef;
    @Output() onTextEvent: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngAfterViewInit() {
        let splited = this.text.split('$')
        if (splited.length > 1) {
            this.paramSelected = splited[1].split(' ')[0]
        }
        this.listenText();
    }

    listenText() {
        this.textSub = fromEvent<KeyboardEvent>(
            this.mensajeInput.nativeElement,
            'keyup'
        )
            .pipe(
                tap((event:KeyboardEvent) => {
                    if (event.key == '$')
                        this.selectParameter = true
                }),
                pluck<KeyboardEvent, string>('target', 'value'),
                startWith(this.text ? this.text : ''),
                debounceTime(1000),
                distinctUntilChanged()
            )

            .subscribe((text) => {
                this.text = text;
                this.onTextEvent.emit(this.text);
            });
    }

    catchParamSelected(param: ParamSelected) {
        this.text = this.text.replace('$', param.value)
        this.selectParameter = false
    }

    ngOnDestroy() {
        this.textSub.unsubscribe();
    }
}
