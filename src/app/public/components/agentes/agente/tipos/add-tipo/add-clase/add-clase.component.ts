import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { TiposService } from '../../tipos.service';
import { Loading } from '../../../../../../../Gdev-Tools/loading/loading.service';

@Component({
    selector: 'aSmart-add-clase',
    templateUrl: './add-clase.component.html',
    styleUrls: ['./add-clase.component.scss'],
})
export class AddClaseComponent implements OnInit {
    switchSinonimosInput: boolean;
    newClaseItem: string;
    newClaseSinonimos: string[] = [];
    readonly separatorKeysCodes: number[] = [COMMA, TAB];

    @Input() clase: Clase;
    @Input() tipo: TipoEntidadModel;
    @ViewChild('sinonimosInput') sinonimosInput: ElementRef;
    @Output() public claseDone = new EventEmitter<boolean>();

    constructor (
        public tipos_: TiposService,
        private loading: Loading
    ) {
        if (this.clase) this.clase.synonyms = [];
    }

    ngOnInit(): void {
        if (this.clase) {
            this.newClaseItem = this.clase.value;
            this.newClaseSinonimos = this.clase.synonyms
                ? this.clase.synonyms
                : [];
            this.tipo.kind;
            if (this.clase.value) {
                this.switchSinonimosInput = true;
            }
        }
    }

    onAddClase(event) {
        event.stopPropagation();
        if (this.newClaseItem) {
            this.clase = { value: this.newClaseItem };
            // this.newClaseItem = '';
        }
        if (this.tipo.kind == 'KIND_MAP') {
            this.newClaseSinonimos.push(this.clase.value);
            // console.log(this.clase);
            this.switchSinonimosInput = true;
            this.loading.waitFor(100);
            this.sinonimosInput.nativeElement.focus();
            this.tipos_.setSinonimo(
                this.tipo.name,
                this.clase,
                this.clase.value,
                'add'
            );
        } else {
            this.tipos_.setClase(this.tipo.name, this.clase);
        }
    }

    async setClase() {
        await this.tipos_.pushCurrent( )
        this.claseDone.emit(true)
        this.newClaseItem = ''
        this.newClaseSinonimos = []
    }

    addSinonimo(event: MatChipInputEvent) {
        if (event.value) {
            this.newClaseSinonimos.push(event.value.trim());
            this.tipos_.setSinonimo(
                this.tipo.name,
                this.clase,
                event.value,
                'add'
            );
        }
        event.input.value = '';
    }

    delSinonimo(sinonimo: string) {
        const index = this.newClaseSinonimos.findIndex(
            (sin) => sin === sinonimo
        );
        this.newClaseSinonimos.splice(index, 1);
        this.tipos_.setSinonimo(this.tipo.name, this.clase, sinonimo, 'del');
    }
}
