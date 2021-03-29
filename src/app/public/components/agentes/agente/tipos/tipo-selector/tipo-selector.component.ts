import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TiposService } from '../tipos.service';
import { CurrentAgenteService } from '../../current-agente.service';
import { CacheService } from '../../../../../../gdev-tools/cache/cache.service';
import { TipoEntidadModel } from '../tipo.model';

@Component({
    selector: 'aSmart-tipo-selector',
    templateUrl: './tipo-selector.component.html',
    styleUrls: ['./tipo-selector.component.scss'],
})
export class TipoSelectorComponent implements OnInit, OnDestroy {
    @Input() value: string;
    @Input() id: any;

    tipos: string[] = [];
    tipoControl = new FormControl();
    tiposFiltered: Observable<string[]>;

    @Output() tipoSelected = new EventEmitter<string>();

    constructor(
        private _tipos: TiposService,
        private _agente: CurrentAgenteService,
        private _cache: CacheService
    ) {}

    async ngOnInit() {
        if (this.value) {
            this.tipoControl.setValue(this.value);
        }
        await this.getTipos();
        this.tiposFiltered = this.tipoControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    async getTipos() {
        this._agente.tiposList$
            .subscribe((list) => {
                if (!list) list = [];
                list.forEach((tipo) => {
                    this.tipos.push(tipo.displayName);
                });
            });
        this._agente.getTiposList()
    }

    private _filter(value: string): string[] {
        console.log( value )
        const filterValue = value.toLowerCase();
        return this.tipos.filter((tipo) =>
            tipo.toLowerCase().includes(filterValue)
        );
    }

    onTipoSelected(event: MatAutocompleteSelectedEvent) {
        // console.log( event.option.value )
        if (event.option) this.tipoSelected.emit(event.option.value);
    }

    ngOnDestroy() {}
}
