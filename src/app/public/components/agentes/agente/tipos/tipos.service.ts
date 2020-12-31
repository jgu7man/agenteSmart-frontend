import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loading } from '../../../../../gdev-tools/loading/loading.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../gdev-tools/cache/cache.service';
import { CurrentAgenteService } from '../current-agente.service';
import { TipoEntidadModel, Clase } from './tipo.model';
import { TextService } from '../../../../../services/text.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../gdev-tools/alerts/alert.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as actions from './store/tipo.actions'
import { TipoState } from './store/tipo.state';

@Injectable( {
    providedIn: 'root'
} )
export class TiposService {

    private tiposPath: string
    private tiposList: TipoEntidadModel[] = []
    
    private _url = 'http://localhost:5000/main-agentesmart/us-central1/dialogflow/entity';
    private _projectId: String;
  
    public closeCreateDialog: Subject<any> = new Subject()
    public currentTipo$: Subject<TipoState> = new Subject()
    private currentTipoSubs: Subscription
    private listSubs: Subscription
    private current: TipoEntidadModel


    constructor (
        private loading: Loading,
        private fs: AngularFirestore,
        private _cache: CacheService,
        private _agente: CurrentAgenteService,
        private _text: TextService,
        private _http: HttpClient,
        private _auth: AuthService,
        private _alerts: AlertService,
        private store: Store<AppState>
    ) {

        this.tiposCollection()
        
        this._projectId = this._cache.getDataKey('projectId');
        // Se suscribe a la lista de entities en el store
        this.listenEntityList()
        // Se suscribe al tipo a editar
        this.getCurrentTipo()
    }
    
    
    

    /** Define la ruta de firestore */
    async tiposCollection() {
        this.tiposPath = await this._agente.getPath( 'tipos' )
        const tiposRef = this.fs.collection( this.tiposPath ).ref
        return tiposRef
    }


 

    // CREATE TIPOS DE DATOS

    /** Prepara la entity para ser creada en el backend, obtiene el ID:name y guarda los datos en firestore */
    async createTipo( tipo: TipoEntidadModel ) {
        // Loading animation
        this.loading.toggleWaitingSpinner( true )
        // Prepare name
        let projectId = this._cache.getDataKey( 'projectId' )
        tipo.displayName = this._text.normalize( tipo.displayName )
        // clean object
        Object.keys( tipo ).forEach( key => {
            if ( tipo[ key ] == undefined ) delete tipo[ key ]
        } )
        // search for duplicated
        const tipoInList: number = this.tiposList
            .findIndex( Tipo => Tipo.displayName === tipo.displayName )


        if ( tipoInList < 0 ) {
            console.log( 'nueva entity' );
            let newEntity = await this._postCreateEntity( { ...tipo } )
            console.log( newEntity );

            const resourceID = newEntity.name.slice( newEntity.name.lastIndexOf( "/" ) + 1 );
            const newTipo = { ...tipo, name: newEntity.name };

            await ( await this.tiposCollection() ).doc( resourceID ).set( newTipo )
            this.store.dispatch(actions.addTipo({tipo: newTipo}))
            
            this.loading.toggleWaitingSpinner(false);
            return newTipo


        } else {
            this._alerts.sendMessageAlert( 'No es posible crear entidades duplicadas' )
        }

    }


    /** Crea el entity en el backend */
    private _postCreateEntity( entityType: TipoEntidadModel ): Promise<TipoEntidadModel> {
        // NOTE POST /entity Necesitas enviar un entityType valido
        // LINK https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IEntityType.html
        console.log( { entityType: { ...entityType } });
        return new Promise( ( resolve, reject ) => {
            this._http.post( this._url  + `/${this._projectId}`, {entityType:{...entityType}}, {
                responseType: "json"
            } )
                .toPromise()
                .then( result => {
                    console.info( "Entity POST Response:", result );
                    if ( result[ 'status' ] == 201 || result[ 'status' ] == 201 ) {
                        //exito creado
                    }
                    resolve( result[ 'result' ] )
                } )
                .catch( err => {
                    if ( err ) {
                        console.error(err);
                        
                        this.loading.toggleWaitingSpinner( false )
                        this._alerts.sendError( 'No fué posible crear ese Tipo en este momento. Intentelo de nuevo porfavor.', err )
                        this.closeCreateDialog.next()
                    }
                    reject( err )
                } )
        } )
    }


    



    // UPDATE

    /** Prepara la entity para ser actualizada en el backend y posterior lo guarda en Firestore */
    async updateTipo( tipo: TipoEntidadModel ) {
        // Loading animation
        this.loading.toggleWaitingSpinner( true )

        console.log(tipo)
        // clean object
        Object.keys( tipo ).forEach( key => {
            if ( tipo[ key ] == undefined ) delete tipo[ key ]
        } )


        await this._putEntityRequest( tipo )
        const resourceID = tipo.name.slice( tipo.name.lastIndexOf( "/" ) + 1 );
        console.log( resourceID );
        await ( await this.tiposCollection() ).doc( resourceID ).set( tipo, { merge: true } )
        this.loading.toggleWaitingSpinner( false )

        // Update cache 
        const tiposList = this._cache.getDataKey<TipoEntidadModel[]>( 'tipos' )
        const tipoIndex = tiposList.findIndex( t => t.name === 'resourceID' )
        tiposList[ tipoIndex ] = tipo
        this._cache.updateData('tipos', tiposList)
        
        

        // End loading animation
        this.loading.toggleWaitingSpinner( false )

        return tipo.name
    }



    /** Actualiza la Entity en el backend */
    private _putEntityRequest( entityType: TipoEntidadModel ) {
        return new Promise( ( resolve, reject ) => {
            this._http.put( this._url, { entityType: entityType } )
                .toPromise()
                .then( result => {
                    console.info( "Entity PUT Response:", result );
                    this._alerts.sendFloatNotification('Tipo guardado')
                    resolve(true)
                    // if ( result[ 'status' ] == "Success" ) {
                    //     //exito creado
                    // }
                } )
                .catch( err => {
                    if ( err ) {
                        console.error(err)
                        this.loading.toggleWaitingSpinner( false )
                        this._alerts.sendError( 'No fué posible crear ese Tipo en este momento.', err )
                        this.closeCreateDialog.next()
                    }
                    reject( err )
                } )
        } )
    }


    /** Agrega una clase a la entity seleccionada por nombre */
    async setClase( tipoName: string, clase: Clase ) {
        
        this.current = this.getTipo(tipoName)
        var clasesList = this.current.entities
        var claseIndex = clasesList.findIndex( cla => cla.value === clase.value )
        console.log({claseIndex});

        if ( claseIndex >= 0 ) {
            clasesList[ claseIndex ] = clase
        } else {
            clasesList = [...clasesList, clase]
        }
        
        this.current = { ...this.current, entities: clasesList }
        this.store.dispatch(actions.editTipo({tipo: this.current}))
        
        return
    }

    /** Agrega sinónimos a la entity actual */
    async setSinonimo( tipoName, clase: Clase, sinonimo: string, action: 'add' | 'del' ) {
        
        if ( !this.current ) { this.current = this.getTipo( tipoName ) }
        var clasesList: Clase[] = this.current.entities
        var claseIndex = clasesList.findIndex(
            c => c.value === clase.value
        )
        if ( claseIndex < 0 ) {
            clasesList = [ ...clasesList, clase ]
            clase[ 'synonyms' ] = []
        } else {
            clasesList = [...clasesList]
        }

        if ( action == 'add' ) {
            clasesList = clasesList.map( c => c.value === clase.value
                ? { ...c, synonyms: [ ...c.synonyms, sinonimo ] } : c )
        } else {
            clasesList.map( c => c.value === clase.value
            ? {...c, synonyms: [...c.synonyms.filter(s => s != sinonimo)]}: c)
        }
        
        this.current = {...this.current, entities: clasesList}
        return
        
    }
    
    async pushCurrent() {
        console.log(this.current);
        this.store.dispatch( actions.editTipo( { tipo: this.current } ) )
        // this.current = undefined
        return
    }

    /** Actualiza la entityType de productos en el agente. Debe dispararse desde la interfaz de productos */
    async updateProductType() {
        let user = await this._auth.getCurrentUser()
        var productTypeRef = this.fs.doc( `usuarios/${ user.uid }` ).ref
            .collection( 'config_docs' ).doc( 'products_types' )
        
        try {
            var productTypesDoc = await productTypeRef.get()
            if ( productTypesDoc.exists ) {
                let productTypes = productTypesDoc.data() as TipoEntidadModel;
                console.log(productTypes['status'])
                
                if ( productTypes[ 'status' ] === 'created' ) {
                    delete productTypes[ 'status' ]
                    delete productTypes.name

                    await this.createTipo( productTypes )
                    this.getAllEntities()
                    this._alerts.sendFloatNotification('Tipo de datos de productos creada')

                } else if ( productTypes[ 'status' ] === 'unsaved' ) {
                    delete productTypes[ 'status' ]

                    await this.updateTipo( productTypes )
                    this.getAllEntities()
                    this._alerts.sendFloatNotification('Tipo de datos de productos actualizada')
                } 
                
                await productTypeRef.update( { status:'saved' } )
            }
        
        } catch ( error ) {
            console.error( error )
            this._alerts.sendError( 'Error', error )
        }
    }

    async setContextType(entity: string) {
        const tiposList = await this._cache.getDataKey<TipoEntidadModel[]>( 'tipos' )
        var contextType: TipoEntidadModel = tiposList.find(
            t => t.displayName === 'contextos'
        )
        
        try {
            // Create Tipo  de contextos
            if ( !contextType ) {
                contextType = new TipoEntidadModel( 'contextos', 'KIND_MAP', 'AUTO_EXPANSION_MODE_DEFAULT', [], true )    
                contextType.entities.push( { value: entity, synonyms: [ entity ] } )

                await this.createTipo( contextType )
            
            
            // Update tipo de contextos
            } else {
                
                contextType.entities.push( { value: entity, synonyms: [ entity ] } )
                await this.updateTipo( contextType )
            
            }
            
            return this.getAllEntities()
            
        } catch (error) {
            console.error(error)
            return this._alerts.sendError('Error', error)
        }
    }

    
    // READ TIPOS DE DATOS


    /** Toma entities del backend */
    getAllEntities(): Observable<any> {
        return this._http.get( `${ this._url }/${ this._projectId }` )
    }

    /** Escucha los cambios de los tipos en el storage */
    listenEntityList() {
        this.listSubs = this.store.select( 'tipos' )
            .pipe( map( tiposState => tiposState.map( t => t.body ) ) )
        .subscribe( tipos => this.tiposList = tipos)
    }

   
    /** Toma una entity basado en el name */
    getTipo(name: string) {
        return this.tiposList.find(t => t.name == name)
    }
    async getByDisplayName(displayName: string) {
        let list = await this._cache.getAsyncKey<TipoEntidadModel[]>('tipos')
        return list.find(t => t.displayName == displayName)
    }

    /** Está pendiendte de la entity seleccionada en el storage */
    getCurrentTipo$( ) {
        return this.store.select( 'tipos' ).pipe( map( tipos => {
            // console.log(tipos);
            let selected = tipos.find( t => t.selected == true )
            return selected
        }) )
    }

    /** Regresa como promesa la entity que se abrió en el panel. Se suscribe en tipo.compoenent.ts */
    getCurrentTipo() {
        this.currentTipoSubs = this.getCurrentTipo$().subscribe( this.currentTipo$ )
    }


    // DELETE review Delete De EntityType
    private _deleteEntityType(entityId: string): Promise<any> {
      return new Promise( ( resolve, reject ) => {
        //elEntity id es el el utlimo pedazo de la uri de NAME del entityType
        //sino se pasa el id solo y se prefiere pasar todo el name la siguiente variable lo extrae
        //Ej. EntityType "name": "projects/testproject-a4323/agent/entityTypes/6c7cd0d9-03f9-47f6-803e-dc39d3ffb789",
        console.log({projectId: this._projectId, entityId})
        
        this._http.delete( this._url + `/${ this._projectId }/${ entityId }` ).toPromise()
            .then(() => { resolve('done')} )
            .catch( err => {
                if ( err ) {
                    let error  = err.error.error
                    console.log( error );
                    if ( error.code === 3 ) {
                        this._alerts.sendMessageAlert('Este tipo de datos es usado en el flujo, no puede ser eliminado')
                    } else {
                        this._alerts.sendError( 'No es posible elimnar intent, error desconocido.', err )
                    }
                }
                reject( err )
            } )
      } )
    }




    async deleteTipo(tipoName: string) {
        this.loading.toggleWaitingSpinner(true)
        const currentId = tipoName.slice( tipoName.lastIndexOf( '/' ) + 1)
        await this._deleteEntityType( currentId )
        await (await this.tiposCollection()).doc(currentId).delete()
        this._alerts.sendFloatNotification('Exito elimando ese tipo de dato.', "ok", 0, "bottom", "left")
        this.loading.toggleWaitingSpinner(false)
        return
    }


    async deleteClase( tipoName: string, claseValue: string, ) {
        
        var current = this.getTipo(tipoName)
        var clasesList = current.entities
        var claseIndex = clasesList.findIndex( clase => clase.value === claseValue )

        if ( claseIndex >= 0 ) {
            clasesList =  clasesList.filter(c => c.value != claseValue)
        }

        current = {...current, entities: clasesList}
        this.store.dispatch(actions.editTipo({tipo: current}))

        
        return

    }


    unsubscribe() {
        this.currentTipoSubs.unsubscribe()
        this.listSubs.unsubscribe()
    }


}
