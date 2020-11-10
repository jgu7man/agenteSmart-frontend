import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {CurrentAgenteService} from '../../../../../../../current-agente.service';
import {CurrentMensajeService} from '../../../../../current-mensaje.service';
import {FormRegistroDatos} from '../../../respuesta.model';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilKeyChanged, tap} from 'rxjs/operators';
import {AlertService} from '../../../../../../../../../../../Gdev-Tools/alerts/alert.service';
import {ColeccionModel, ParamExpected} from '../../../../../../../../../colecciones/collection.interface';
import {CacheService} from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'aSmart-grupo-datos',
    templateUrl: './grupo-datos.component.html',
    styleUrls: ['./grupo-datos.component.scss']
})
export class GrupoDatosComponent implements OnInit {

    paramSelected: string = ''
    // dataGroups: any[]
    dataGroupSelected: string = ''
    colecciones: ColeccionModel[]
    colSelected: ColeccionModel

    KeySpected: ParamExpected[] 

    dataForm: FormRegistroDatos = new FormRegistroDatos('texto', '', this.paramSelected, this.dataGroupSelected, '')

    private _RegistroDatosForm = new BehaviorSubject<FormRegistroDatos>(this.dataForm);
    @Input() set RegistroDatosForm(form: FormRegistroDatos) {this._RegistroDatosForm.next(form);}
    get RegistroDatosForm() {return this._RegistroDatosForm.getValue()}

    @Output() edited = new EventEmitter<FormRegistroDatos>();

    constructor (
        public agente_: CurrentAgenteService,
        public mensaje_: CurrentMensajeService,
        public _alerts: AlertService,
        private _cache: CacheService
    ) {
        this.colSelected = new ColeccionModel('', [])
    }

    async ngOnInit() {
        this.colecciones = await this._cache.getAsyncKey('colecciones')
        this._RegistroDatosForm.pipe(
            distinctUntilKeyChanged('parametro')
        ).subscribe(form => {
            this.dataForm = form
            this.setSaveKeys(form.grupoDatos)
        })
    }

    setSaveKeys(coleccion: string) {
        this.colSelected = this.colecciones
            .find(col => col.name === coleccion);
        this.colSelected.saveKeys = !this.colSelected.saveKeys ? []
            : this.colSelected.saveKeys  
    }

    catchColSelected(selected: MatSelectChange) {
        this.setSaveKeys(selected.value) 
    }

    validateColeccionOnClick() {
        if (this.colecciones.length < 1) {
            this._alerts.sendMessageAlert('Debes crear una colección primero')
        }
    }

    validateKeySpectedOnClick() {
        if (this.colSelected.saveKeys.length < 1) {
            this._alerts.sendMessageAlert(`Debes agregar palabras claves a la colección ${this.colSelected.name}`)
        }
    }

    


}
