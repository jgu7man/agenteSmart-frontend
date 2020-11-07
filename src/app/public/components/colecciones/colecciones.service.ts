import {Injectable} from '@angular/core';
import { ColeccionModel } from './collection.interface';
import { AngularFirestore,  CollectionReference } from '@angular/fire/firestore';
import { CacheService} from '../../../Gdev-Tools/cache/cache.service';
import { AlertService} from '../../../Gdev-Tools/alerts/alert.service';
import { UserInterface} from '../../../admin/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ColeccionesService {
    
    /** Almacena la lista actualizada de colecciones */
    public list: ColeccionModel[]
    /** Almacena la ruta de FIRESTORE a las colecciones */
    private coleccionesPath: string
    /** Almacena la información del usuario actual */
    private usuario: UserInterface

    constructor (
        private fs: AngularFirestore,
        private _cache: CacheService,
        private _alerts: AlertService,
    ) {
        // Inicia las colecciones
        this.getColecciones()
    }

    /**
     * Genera la referencia de las colecciones a la collection de FIRESTORE con la ruta integrada
     * @returns {*}  {Promise<CollectionReference>}
     */
    async coleccionesRef(): Promise<CollectionReference> {
        return this.fs.collection(this.coleccionesPath).ref
    }

    /** Inicia y almacena las colecciones LIST */
    async getColecciones() {
        this.usuario = await this._cache.getAsyncKey<UserInterface>('user')
        this.coleccionesPath = `usuarios/${this.usuario.uid}/colecciones`

        this.fs.collection<ColeccionModel>(this.coleccionesPath)
            .valueChanges()
            .subscribe(async list => {
                this._cache.updateData<ColeccionModel[]>('colecciones', list)
                this.list = await this._cache.getAsyncKey<ColeccionModel[]>('colecciones')
            })

    }


    /**
     * Agrega coleccion a FIRESTORE
     *
     * @param {*} coleccion ColeccionModel
     */
    async addColeccion(coleccion: ColeccionModel) {
        var newCol = this.list
            .find(col => col.name == coleccion.name);

        if (newCol) {
            this._alerts.sendMessageAlert('Elige otro nombre por que ese ya existe en tus colecciones')
        } else {
            newCol = {name: coleccion.name}
            console.log(newCol);
            (await this.coleccionesRef()).doc(newCol.name).set(newCol)
        }
        return
    }


    /**
     * Actualiza la colección
     *
     * @param {ColeccionModel} coleccion Actualiza toda la colección
     */
    async updateDataColeccion(coleccion: ColeccionModel) {

        Object.keys(coleccion).forEach(key => {
            if (coleccion[key] == undefined) delete coleccion[key]
        })

        try {
            await this.fs.collection(this.coleccionesPath).ref.doc(coleccion.name)
                .update({...coleccion})
            this._alerts.sendFloatNotification('Colección guardada')
            return
        } catch (error) {
            console.error(error);
            this._alerts.sendError('No se pudo guardar', error)
        }
    }

    /**
     * Elimina la colección
     *
     * @param {*} colName name de la colección
     */
    async delete(colName:string) {
        await this.fs.collection(this.coleccionesPath).ref.doc(colName)
            .delete()
    }


}
