import { RespuestaCard } from './../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuestasIntent.model';
import {Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input} from '@angular/core';
import {Observable} from 'rxjs';
// import {RespuestaCard} from '../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import {GdevCache} from '../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import {UserInterface} from '../../../../admin/auth/auth.service';

@Component({
    selector: 'aSmart-estatica-tarjeta',
    templateUrl: './estatica-tarjeta.component.html',
    styleUrls: ['./estatica-tarjeta.component.scss']
})
export class EstaticaTarjetaComponent implements OnInit {

    @ViewChild('titulo') tituloInput: ElementRef
    private listenTitulo: Observable<string>
    @ViewChild('body') bodyInput: ElementRef

    user: UserInterface

    @Output() edited: EventEmitter<RespuestaCard> = new EventEmitter()
    @Input() contenido: RespuestaCard = {
        title: '', body: '', imageUri: ''
    }

    constructor (
        private _cache: GdevCache
    ) {}


    ngOnInit(): void {
        this.user = this._cache.getDataKey('user')
    }

    catchImgURL(image) {
        this.contenido.imageUri = image
        this.edited.emit(this.contenido)
    }


}
