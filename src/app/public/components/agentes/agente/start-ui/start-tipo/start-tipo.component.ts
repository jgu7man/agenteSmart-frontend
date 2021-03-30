import { ClaseItemComponent } from './../../tipos/tipo/clase-item/clase-item.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GdevCache } from './../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { TiposService } from './../../tipos/tipos.service';
import { Clase, TipoEntidadModel } from './../../tipos/tipo.model';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Output, EventEmitter, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-start-tipo',
  templateUrl: './start-tipo.component.html',
  styleUrls: ['./start-tipo.component.scss']
})
export class StartTipoComponent implements OnInit, OnDestroy {

    tipo: TipoEntidadModel;
    @ViewChild('editInput') editInput: ElementRef;
    @ViewChildren(ClaseItemComponent) ClaseItemList: QueryList<
    ClaseItemComponent
        >;
        switchAddClase: boolean;
        clases: Clase[];
    @Output() tipoAdded = new EventEmitter<any>();

    switchEditTipo: boolean = false;
    projectId: string
    newClaseItem: string;
    ClaseInput: boolean = false;
    tiposSubcription: Subscription

    constructor (
        public tipos_: TiposService,
        private _cache: GdevCache
    ) {
        this.tipo = new TipoEntidadModel('palabrasclave','KIND_LIST','AUTO_EXPANSION_MODE_DEFAULT',[], true)
        this.projectId = this._cache.getDataKey('projectId')
     }

    async ngOnInit() {
        this.tiposSubcription =
        this._cache.listenForChanges<TipoEntidadModel[]>('tipos')
            .pipe( debounceTime(1000))
            .subscribe(tipos => {
            if (tipos.length > 0) {
                let palabrasClave = tipos.find(t => t.displayName == 'palabrasclave')
                if (palabrasClave) {
                    this.tipo = palabrasClave
                }
            }
        })
    }

    onSave() {

        console.log( this.tipo )
        this.tipos_.createTipoContextos(this.tipo).then(() => {
            this.tipoAdded.emit()
        });
    }


    delSpaces(e) {
        if (e.which === 32) {
            e.stopPropagation();
            return false;
        } else if (e.which === 13) {
            e.stopPropagation();
        }
    }




    async toEditClase(id: string) {
        // this.edited.emit(this.tipo)
        const claseToEdit = this.ClaseItemList.find(
            (claseItem) => claseItem.claseId == id
        );
        claseToEdit.switchClaseInput();
    }

    onKindChange(event: MatCheckboxChange) {
        this.tipo.kind = event.checked ? 'KIND_MAP' : 'KIND_LIST';
    }

    onExpantionChange(event: MatCheckboxChange) {
        this.tipo.autoExpansionMode = event.checked
            ? 'AUTO_EXPANSION_MODE_DEFAULT'
            : 'AUTO_EXPANSION_MODE_UNSPECIFIED'

    }

    onFuzzyChange(event: MatCheckboxChange) {
        this.tipo.enableFuzzyExtraction = event.checked ? true : false
    }


    onAddClase(event) {
        event.stopPropagation();
        let clase = { value: this.newClaseItem };
        this.newClaseItem = ''
        this.tipo.entities.push(clase)
    }

    onDelClase(claseIndex:number) {
        this.tipo.entities.splice(claseIndex, 1)
    }


    ngOnDestroy() {
        this.tiposSubcription.unsubscribe()
    }
}
