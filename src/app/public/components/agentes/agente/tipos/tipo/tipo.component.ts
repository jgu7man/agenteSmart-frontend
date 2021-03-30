import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { TipoEntidadModel } from '../tipo.model';
import { TiposService } from '../tipos.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../app.state';
import * as actions from '../store/tipo.actions';
import { Router } from '@angular/router';
import { GdevCache } from '../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';

@Component({
    selector: 'aSmart-tipo',
    templateUrl: './tipo.component.html',
    styleUrls: ['./tipo.component.scss'],
})
export class TipoComponent implements OnInit {
    tipo: TipoEntidadModel;
    @Input() name: string;
    @ViewChild('editInput') editInput: ElementRef;
    @Output() closePanel = new EventEmitter<any>();

    switchEditTipo: boolean = false;
    projectId: string

    constructor (
        public tipos_: TiposService,
        private store: Store<AppState>,
        private _router: Router,
        private _cache: GdevCache
    ) {
        this.projectId = this._cache.getDataKey('projectId')
     }

    async ngOnInit() {}

    onSave() {
        this.tipo = this.tipos_.getTipo(this.name);
        console.log(this.tipo);
        this.tipos_.updateTipo(this.tipo).then(() => {
            this.store.dispatch(actions.toggleSaved({ tipo: this.tipo }));
            this.closePanel.emit();
        });
    }

    onClose() {
        this.closePanel.emit();
        this.store.dispatch(actions.unselect());
    }

    async delete( tipoName ) {
        let url = `/dahsboard/agente/${this.projectId}/`
        await this.tipos_.deleteTipo( tipoName );
        this._router.navigateByUrl( url, { skipLocationChange: true } )
            .then(() => this._router.navigate([url+'tipos']))
    }

    delSpaces(e) {
        if (e.which === 32) {
            e.stopPropagation();
            return false;
        } else if (e.which === 13) {
            e.stopPropagation();
        }
    }

    // onDeleteTipo() {
    //   this.tiposService.deleteTipo( this.tipo.name )
    //     .then(()=> {this.tipoDeleted.emit(this.tipo.name)})
    // }
}
