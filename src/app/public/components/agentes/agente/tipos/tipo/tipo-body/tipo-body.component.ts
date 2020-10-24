import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChildren,
    QueryList,
    Output,
    EventEmitter,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { ClaseItemComponent } from '../clase-item/clase-item.component';
import * as actions from '../../store/tipo.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../../app.state';
import { TipoState } from '../../store/tipo.state';

@Component({
    selector: 'aSmart-tipo-body',
    templateUrl: './tipo-body.component.html',
    styleUrls: ['./tipo-body.component.scss'],
})
export class TipoBodyComponent implements OnInit, OnDestroy {
    @Input() tipo: TipoState;
    @ViewChildren(ClaseItemComponent) ClaseItemList: QueryList<
        ClaseItemComponent
    >;
    @Output() edited = new EventEmitter<TipoEntidadModel>();

    switchAddClase: boolean;
    clases: Clase[];

    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {}

    async toEditClase(id: string) {
        // this.edited.emit(this.tipo)
        const claseToEdit = this.ClaseItemList.find(
            (claseItem) => claseItem.claseId == id
        );
        claseToEdit.switchClaseInput();
    }

    onKindChange(event: MatCheckboxChange) {
        this.tipo = {
            ...this.tipo,
            body: {
                ...this.tipo.body,
                kind: event.checked ? 'KIND_MAP' : 'KIND_LIST',
            },
        };
        this.store.dispatch(actions.editTipo({ tipo: this.tipo.body }));
    }

    onExpanptionChange(event: MatCheckboxChange) {
        this.tipo = {
            ...this.tipo,
            body: {
                ...this.tipo.body,
                autoExpansionMode: event.checked
                    ? 'AUTO_EXPANSION_MODE_DEFAULT'
                    : 'AUTO_EXPANSION_MODE_UNSPECIFIED',
            },
        };
        this.store.dispatch(actions.editTipo({ tipo: this.tipo.body }));
    }

    onFuzzyChange(event: MatCheckboxChange) {
        this.tipo = {
            ...this.tipo,
            body: {
                ...this.tipo.body,
                enableFuzzyExtraction: event.checked ? true : false,
            },
        };
        this.store.dispatch(actions.editTipo({ tipo: this.tipo.body }));
    }

    ngOnDestroy() {
        this.store.dispatch(actions.unselect());
    }
}
