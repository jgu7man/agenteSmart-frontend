import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CacheService } from '../../../../../../gdev-tools/cache/cache.service';
import { ContextoModel } from '../contexto.model';
import { MatDialog } from '@angular/material/dialog';
import { AddContextoDialogComponent } from '../add-contexto-dialog/add-contexto-dialog.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'aSmart-contexto-selector',
    templateUrl: './contexto-selector.component.html',
    styleUrls: ['./contexto-selector.component.scss'],
})
export class ContextoSelectorComponent implements OnInit {
    contextLists;
    contextNameList;
    nuevoContexto;

    @Input() contexto: string
    @Output() sendContextSelected: EventEmitter<ContextSelected> = new EventEmitter();

    constructor(private _cache: CacheService, private _dialog: MatDialog) {}

    ngOnInit(): void {
        this.getContextList();
        console.log(this.contexto);
    }

    getContextList() {
        this.contextLists = this._cache.getDataKey<any>('contextosLists');
        if (this.contextLists) {
            this.contextNameList = Object.keys(this.contextLists);
        } else {
            let agenteContext = this._cache.getDataKey<ContextoModel[]>(
                'contextos'
            );
            console.log(agenteContext)
            if (agenteContext) {
                this.contextNameList = agenteContext.map(
                    (context) => context.contextName
                );
            } else {
                this.contextNameList = [];
            }
        }

        this.nuevoContexto = {
            contextName: '',
            lifespanCount: 3,
            index: this.contextLists.length,
        };
    }

    catchContextSelected(selection: MatSelectChange) {
        let context = selection.value
        let continueIntents = []
        if (this.contextLists) {
            continueIntents = this.contextLists[context]
        }
        this.sendContextSelected.emit({context, continueIntents});

    }

    openContextCreator() {
        var dialog = this._dialog.open(AddContextoDialogComponent, {
            minWidth: 300,
            data: this.nuevoContexto,
        });

        dialog.afterClosed().subscribe((result: ContextoModel) => {
            if (result) this.contextNameList.push(result.contextName);
        });
    }
}


export interface ContextSelected {
    context: string,
    continueIntents: any[]
}
