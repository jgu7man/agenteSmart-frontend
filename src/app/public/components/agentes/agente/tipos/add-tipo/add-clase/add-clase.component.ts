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
import { GdevLoading } from '../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { GdevText } from 'src/app/services/text.service';

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
        private _loading: GdevLoading,
        private _text: GdevText
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

    delSpaces(e) {
        this._text.normalize(this.newClaseItem)
        if ( e.which === 32 ) {
          this.newClaseItem.valueOf().replace( /\s/g, '' )
          return false
        }

      }

    onAddClase(event) {
        event.stopPropagation();
        if (this.newClaseItem) {
            this.clase = { value: this.newClaseItem };
            // this.newClaseItem = '';
        }
        console.log( this.tipo.kind, this.clase )
        if (this.tipo.kind == 'KIND_MAP') {
            this.newClaseSinonimos.push(this.clase.value);
            // console.log(this.clase);
            this.switchSinonimosInput = true;
            this._loading.waitFor(100);
            this.sinonimosInput.nativeElement.focus();
            this.tipos_.setSinonimo(
                this.tipo.name,
                this.clase,
                this.clase.value,
                'add'
            );
        } else {
            console.log( this.tipo.name, this.clase )
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
