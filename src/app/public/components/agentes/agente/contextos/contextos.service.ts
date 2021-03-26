import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MensajesService } from '../mensajes/mensajes.service';
import { IntentModel, MensajeModel } from '../mensajes/mensaje.model';
import { CacheService } from '../../../../../gdev-tools/cache/cache.service';
import { ContextoModel } from './contexto.model';
import { CurrentAgenteService } from '../current-agente.service';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { AlertService } from '../../../../../gdev-tools/alerts/alert.service';
import { Loading } from '../../../../../gdev-tools/loading/loading.service';
import { Subject, Subscription } from 'rxjs';
import { ColorService } from '../../../../../gdev-tools/color/color.service';
import { TiposService } from '../tipos/tipos.service';
import { TipoEntidadModel } from '../tipos/tipo.model';
import { CurrentMensajeService } from '../mensajes/mensaje/current-mensaje.service';
import { TextService } from 'src/app/gdev-tools/text/gdev-text.service';

@Injectable({
    providedIn: 'root',
})
export class ContextosService {
    /** Ruta de los mensajes para acciones del CRUD */
    private agentePath;
    /** Contexto actualizado optenido de la ruta */
    currentContexto: string;
    /** Consulta de los contextos de la base de datos */
    contextQuery$: Subject<ContextoModel> = new Subject();
    /** Lista actualizada de los contextos en orden de aparición (index) */
    list: ContextoModel[];

    constructor(
        private _agente: CurrentAgenteService,
        private _alerts: AlertService,
        private _cache: CacheService,
        private _color: ColorService,
        private _currentMensaje: CurrentMensajeService,
        private _mensajes: MensajesService,
        private _text: TextService,
        private _tipos: TiposService,
        private afs: AngularFirestore,
        private loading: Loading,
    ) {
        // Obtiene el contexto de la ruta actual
        this.loading.getRouteQueryParams().subscribe((queryParams) => {
            this.currentContexto = queryParams['contexto'];
        });
    }

    /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
    private async contextosCollection() {
        this.agentePath = await this._agente.getPath('contextos');
        const contextosRef = this.afs.collection(this.agentePath).ref;
        return contextosRef;
    }

    // SECTION CRUD de contextos

    // CREATE

    async setContext(contexto: ContextoModel) {
        try {
            contexto.color = this._color.generateHSLcolor(50, 50);
            this.list = this._cache.getDataKey<ContextoModel[]>( 'contextos' );
            const contextName = contexto.contextName
            console.log(this.list)

            Object.keys( contexto ).forEach( key => {
                if ( contexto[ key ] == undefined ) delete contexto[ key ]
            } )

            // Contexto nuevo
            if ( !contexto.id ) {
                let contextFinded = this.list.find(
                    (context) => context.contextName === contextName
                );

                console.log(!contextFinded)

                // Agrega contexto nuevo
                if (!contextFinded) {

                    contexto.contextName = this._text.normalize( contexto.contextName).toLowerCase()

                    let contextNuevo = await (
                        await this.contextosCollection()
                    ).add(contexto);
                    contextNuevo.update({ id: contextNuevo.id });
                    contexto.id = contextNuevo.id;

                    await this._mensajes.setContextMensaje( contextName )
                    await this._tipos.setContextType( contextName )

                // Contexto duplicado
                } else {
                    this._alerts.sendMessageAlert('Contexto duplicado');
                }

            // Actualiza contexto
            } else {
                // Crea un nuevo contexto
                await (await this.contextosCollection())
                    .doc(contexto.id)
                    .update(contexto);
            }

            this._agente.getContextosList()
            return contexto;
        } catch (error) {
            console.error(error);
            this._alerts.sendError('Error al crear el nuevo contexto', error);
        }
    }

    // READ
    /** Obtiene el contexto en curso de la session storage */
    async getCurrentContexto() {
        if (!this.currentContexto) {
            this.currentContexto = await this._cache.getDataKey(
                'currentContexto'
            );
            if (!this.currentContexto) return '';
        }
        return this.currentContexto;
    }

    async getOneContext(contexto: ContextoModel) {
        var contextDoc = await (await this.contextosCollection())
            .doc(contexto.id)
            .get();
        var contextGeted: ContextoModel = contextDoc.data() as ContextoModel;
        return contextGeted;
    }

    // READ ALL

    /** Se suscribe para optener todos los contexto del agente en curso */
    private subscribeAllContext: Subscription;

    /** Escucha todos los contextos en tiempo real */
    async getAllContexts() {
        this.subscribeAllContext = this.contextQuery$
            .pipe(distinctUntilKeyChanged('contextName'))
            .subscribe((contexto) => {
                this.list.push(contexto);
                this._cache.updateData('allContexts', this.list);
            });

        this.list = [];
        var contextCol = await (await this.contextosCollection())
            .orderBy('index')
            .get();
        // console.log( contextCol.size );

        contextCol.forEach((contexto) => {
            this.contextQuery$.next(contexto.data() as ContextoModel);
        });

        return this.list;
    }

    /** Se desuscribe cunado la vista de contextos no está en pantalla */
    unsubscribeAllContext() {
        // this.subscribeAllContext.unsubscribe()
    }

    // UPDATE Index

    /** Actualiza el orden de los contextos en la vista de contextos */
    async updateIndex(contextos: ContextoModel[]) {
        contextos.forEach(async (contexto, index) => {
            await (await this.contextosCollection())
                .doc(contexto.id)
                .update({ index: index });
        });
        return;
    }

    // DELETE

    async delContext(context: ContextoModel) {

        await this.deleteContextFromMensajes( context )
        await this.deleteContextFromIntent( context.contextName )
        await this.deleteContextFromTipo(context.contextName)
        await ( await this.contextosCollection() ).doc( context.id ).delete();

        console.log('Context deleted')
        return
    }


    private deleteContextFromIntent( context: string ) {
        const intentList = this._cache.getDataKey<IntentModel[]>( 'intents' )
        const contextIntent = intentList.find(
            i => i.displayName === 'Default Context Intent'
        )

        contextIntent.parameters = contextIntent.parameters.map( c => {
            if (c.displayName !== context) return c
        } )

        contextIntent.trainingPhrases = contextIntent.trainingPhrases.map( t => {
            if (t.parts[0].text !== context) return t
        } )

        this._currentMensaje.update( contextIntent )
        return
    }


    private async deleteContextFromTipo( context: string ) {
        const tiposList = await this._cache.getDataKey<TipoEntidadModel[]>( 'contextos' );
        const contextType = tiposList.find( c => c.displayName === context )
        if ( contextType ) {
            contextType.entities = contextType.entities.map( entity => {
                if (entity.value != context) return entity
            } )
            await this._tipos.updateTipo(contextType)
            console.log('Entities list updated')
        }
        return
    }

    private async deleteContextFromMensajes( context: ContextoModel ) {
        var mensajesPath = await this._agente.getPath('mensajes');
        const mensajeRef = this.afs.collection(mensajesPath).ref;

        this._mensajes.getMensajesListByContexto(context)
            .then(mensajes => {
                if (mensajes.length > 0) {
                    mensajes.forEach((mensaje: IntentModel) => {
                        let contextToDel = mensaje.contextos.findIndex(
                            (ent) => ent === context.id
                        );

                        mensaje.contextos.splice(contextToDel, 1);
                        mensajeRef
                        .doc(mensaje.name)
                        .set({ contextos: mensaje.contextos }, { merge: true });
                    } );

                    console.log('Intents updated')
                }
            })



        return
    }


    setContextosList(contextName: string, list: MensajeModel[]) {
        let contextosLists = this._cache.getDataKey('contextosLists');
        let agentContextos = this._cache.getDataKey<ContextoModel[]>('contextos')

        if (!contextosLists) contextosLists = { [contextName]: list }
        else contextosLists[contextName] = list
        if (agentContextos) Object.keys(contextosLists).forEach((name) => {
                let contexto = agentContextos.find(c => c.contextName == name)
                if (!contexto) delete contextosLists[name]
            })

        this._cache.updateData('contextosLists', contextosLists);

    }
}
