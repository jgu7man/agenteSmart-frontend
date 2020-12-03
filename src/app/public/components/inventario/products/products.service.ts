import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { GdevStoreProductModel } from './product.model';
import { Subject } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore'
import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { finalize } from 'rxjs/operators';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { UserInterface } from '../../../../admin/auth/auth.service';
import { TipoEntidadModel, Clase } from '../../agentes/agente/tipos/tipo.model';

@Injectable({providedIn: 'root'})
export class GdevStoreProductsService {

    imageUrl: Subject<{}> = new Subject()
    galleyImageUrl: Subject<{}> = new Subject()
    imageLoadPercent
    usuario: UserInterface

    constructor (
        private fs: AngularFirestore,
        private ft: AngularFireStorage,
        private _alerts: AlertService,
        private _cache: CacheService,
    ) {
        this.usuario = this._cache.getDataKey('user')
     }
    
    get usuarioRef() {
        return this.fs.doc(`usuarios/${this.usuario.uid}`).ref
    }

    get productsRef() {
        return this.usuarioRef.collection('productos')
    }


    async addProduct(product: GdevStoreProductModel) {
        try {
            
            var productId: string = product.referencia.split( ' ' ).join( '-' ).toLowerCase()
            var dotsSplit = productId.split( '.' )
            productId = dotsSplit.length == 1 ? productId : dotsSplit.join( '_' )
            
            Object.keys(product).forEach(key => {if(product[key] == undefined) delete product[key]})
            var productObject = {}
            productObject = { ...productObject, ...product }
            productObject['id'] = productId
            
            await this.productsRef.doc( productId ).set( productObject )
            
            if ( product.sinonimos ) {
                this.saveProductTipo( product.referencia, product.sinonimos, productId)
            }

            this._alerts.sendFloatNotification('Producto agregado')
            
            return true
        } catch ( error ) {
            this._alerts.sendError('No se pudo guardar', error)
            console.log(error);
        }
    }


    async saveProductTipo(referencia: string, sinonimos: string[], name: string) {
        try {
            var productClase: Clase = { value: referencia, synonyms: sinonimos }
            var products_type = this.usuarioRef.collection( 'config_docs' ).doc( 'products_types' )
            var typesDoc = await products_type.get()

            if ( typesDoc.exists ) {
                console.log('Existen tipo');
                let types = typesDoc.data() as TipoEntidadModel
                types.entities = [ ...types.entities, productClase ]
                products_type.update( types )


            } else {
                console.log('No existen tipos');
                let newTipo: TipoEntidadModel = new TipoEntidadModel(
                    referencia,
                    'KIND_MAP',
                    'AUTO_EXPANSION_MODE_DEFAULT',
                    [ productClase ],
                    true,
                    name,
                )
                
                console.log(newTipo);
                products_type.set( {...newTipo} )
            }
        } catch ( error ) {
            console.error(error);
            this._alerts.sendFloatNotification( 'No se pudo guardar los sinónimos' )
        }
    }




    async addProductImage(file) {
        const
            dateId = new Date().getTime(),
            fileName = `${ dateId }-${ file.name }`,
            path = `products/${ fileName }`,
            ref = this.ft.ref( path ),
            task = this.ft.upload( path, file );

        await task.percentageChanges().subscribe( res => {
            return this.imageLoadPercent = res
        } )

        await task.snapshotChanges().pipe(
            finalize( async () => {
                await ref.getDownloadURL()
                    .subscribe( res => {
                        this.imageUrl.next( { url: res, alt: file.name } )
                    } )
                return
            } )
        ).subscribe()
    }



    async loadGalleryImage( image ) {
        let
            dateId = new Date().getTime(),
            fileName = `${ dateId }-${ image.name }`,
            path = `products/${ fileName }`,
            ref = this.ft.ref( path ),
            task = this.ft.upload( path, image )
        
        

        await task.snapshotChanges().pipe(
            finalize( async () => {
                await ref.getDownloadURL().subscribe( res => {
                    this.imageUrl.next( { url: res, alt: image.name } )
                } )
                return
            } ) ).subscribe()
    }


    async getProduct(productId: string) {
        try {
            const productRef = this.fs.collection( 'tienda/productos/referencias' ).ref.doc( productId )
            const productDoc = await productRef.get()
            var product = productDoc.data() as GdevStoreProductModel
            return product
        } catch (error) {
            console.log(error);
        }            
    }


    async updateProduct( product: GdevStoreProductModel) {
        try {
            var productObject = {}
            productObject = { ...productObject, ...product }

            const colRef = this.fs.collection( 'tienda/productos/referencias' ).ref;
            console.log(productObject);
            await colRef.doc( product.id ).update( productObject )

            this._alerts.sendFloatNotification('Producto guardado')
            return true
        } catch ( error ) {
            this._alerts.sendMessageAlert('Ups, algo falló. No se guardó')
            console.error(error);
        }
    }

    async onDelAttr( itemAttr ) {
        var itemId = itemAttr.idItem, itemAttr = itemAttr.attrItem
        const productRef = this.fs.collection( 'tienda/productos/referencias' ).ref
        productRef.doc( itemId ).update( {
            [ itemAttr ]: firebase.firestore.FieldValue.delete()
        } )
        this._alerts.sendFloatNotification('Producto eliminado')
        return 
    }


    async delProduct( productId: string ) {
        try {
            const productRef = this.fs.collection( 'tienda/productos/referencias' ).ref
            await productRef.doc( productId ).delete()
            return true
        } catch ( error ) { console.error( error ); }
    }

}