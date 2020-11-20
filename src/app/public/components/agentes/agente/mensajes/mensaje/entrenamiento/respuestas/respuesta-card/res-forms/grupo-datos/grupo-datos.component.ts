import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {CurrentAgenteService} from '../../../../../../../current-agente.service';
import {CurrentMensajeService} from '../../../../../current-mensaje.service';
import {RegistroDatosModel} from '../../../respuesta.model';
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

    dataForm: RegistroDatosModel = new RegistroDatosModel('', this.paramSelected, this.dataGroupSelected, '')

    private _RegistroDatosForm = new BehaviorSubject<RegistroDatosModel>(this.dataForm);
    @Input() set RegistroDatosForm(form: RegistroDatosModel) {this._RegistroDatosForm.next(form);}
    get RegistroDatosForm() {return this._RegistroDatosForm.getValue()}

    @Output() edited = new EventEmitter<RegistroDatosModel>();

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
            this.setSaveKeys(form.coleccion)
        })
    }

    setSaveKeys(coleccion: string) {
        this.colSelected = this.colecciones
            .find(col => col.name === coleccion);
            console.log(this.colSelected);
        if (this.colSelected) {
            this.colSelected.saveKeys = !this.colSelected.saveKeys ? []
                : this.colSelected.saveKeys  
        } else {
            this.colSelected = new ColeccionModel('', [])
        }
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
