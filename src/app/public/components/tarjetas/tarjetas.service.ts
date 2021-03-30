import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { TarjetaModel } from './tarjeta.model';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { GdevCommonsService } from 'src/app/gdev-tools/src/lib/common/services/gdev-commons.service';
import { GdevCache } from '../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { UserInterface } from '../../../admin/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class TarjetasService {
    
    /** Almacena el usuario en curso */
    private usuario: UserInterface;
    /** Almacena la ruta de refrencia en FIRESTORE */
    private tarjetasPath: string;
    /** Almacena el array de Tarjetas */
    public list: TarjetaModel[];

    constructor(
        private fs: AngularFirestore,
        private _alert: GdevAlert,
        private _commons: GdevCommonsService,
        private _cache: GdevCache
    ) {
        this.getTarjetas()
    }


    /**
     * Genera la referencia de FIRESTORE para manejar las tarjetas
     * @returns {*}  {Promise<CollectionReference>}
     */
    async tarjetaRef():Promise<CollectionReference> {
        return this.fs.collection(this.tarjetasPath).ref;
    }

    
    /**
     * Genera la ruta para suscribirse a los cambios de las tarjetas en FIRESTORE y retorna la lista
     * @returns {*}  {Promise<TarjetaModel[]>} Array de tarjetas
     */
    async getTarjetas(): Promise<TarjetaModel[]> {
        this.usuario = await this._cache.getAsyncKey<UserInterface>('user');
        this.tarjetasPath = `usuarios/${this.usuario.uid}/tarjetas`;

        this.fs
            .collection<TarjetaModel>(this.tarjetasPath)
            .valueChanges()
            .subscribe(async list => {
                this._cache.updateData<TarjetaModel[]>('tarjetas', list)
                this.list = await this._cache.getAsyncKey<TarjetaModel[]>(
                    'tarjetas'
                );
            });
            
            return this.list
    }

    // CREATE
    /**
     * Crea una tarjeta
     *
     * @param {TarjetaModel} tarjeta TarjetaModel
     * @returns {*} void
     */
    async addTarjeta(tarjeta: TarjetaModel) {

        console.log(tarjeta);
        Object.keys(tarjeta).forEach(
            key => {if (tarjeta[key] == undefined) delete tarjeta[key]}
        )
        
        tarjeta.name = await this._commons.preventDuplicated(
            tarjeta,
            this.list,
            'name'
        );
        console.log(tarjeta.name);

        try {
            await (await this.tarjetaRef())
                .add({...tarjeta}).then(res => {
                    res.update({id: res.id})
                })
            this._alert.sendFloatNotification('Tarjeta creada', 'ok');
            return;
        } catch (error) {
            this._alert.sendError('Ups! Algo salio mal', error);
        }
    }

    // UPDATE
    /**
     * Guarda los cambios en la tarjeta
     *
     * @param {TarjetaModel} tarjeta TarjetaModel
     * @returns {*} void
     */
    async saveTarjeta(tarjeta: TarjetaModel) {
        try {
            await (await this.tarjetaRef())
                .doc(tarjeta.id)
                .set({ ...tarjeta }, { merge: true });
            this._alert.sendFloatNotification('Tarjeta guardada', 'ok');
            return;
        } catch (error) {
            this._alert.sendError('Ups! Algo salio mal', error);
        }
    }

    // DELETE
    /**
     * Elimina la tarjeta de FIRESTORE
     *
     * @param {string} tarjetaID identificador de la tarjeta
     */
    async deleteTarjeta(tarjetaID: string) {
        try {
            await (await this.tarjetaRef()).doc(tarjetaID).delete();
        } catch (error) {
            this._alert.sendError('Ups! Algo salio mal', error);
        }
    }
}
