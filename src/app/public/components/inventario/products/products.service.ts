import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { GdevStoreProductModel } from './product.model';
import { Subject } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { finalize } from 'rxjs/operators';
import { GdevCache } from '../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { UserInterface } from '../../../../admin/auth/auth.service';
import { TipoEntidadModel, Clase } from '../../agentes/agente/tipos/tipo.model';

@Injectable({ providedIn: 'root' })
export class GdevStoreProductsService {
    imageUrl: Subject<{}> = new Subject();
    galleyImageUrl: Subject<{}> = new Subject();
    imageLoadPercent;
    usuario: UserInterface;

    constructor(
        private fs: AngularFirestore,
        private ft: AngularFireStorage,
        private _alerts: GdevAlert,
        private _cache: GdevCache
    ) {
        this.usuario = this._cache.getDataKey('user');
    }

    get usuarioRef() {
        return this.fs.doc(`usuarios/${this.usuario.uid}`).ref;
    }

    get productsRef() {
        return this.usuarioRef.collection('productos');
    }

    get typesDocRef() {
        return this.usuarioRef.collection('config_docs').doc('product_types');
    }

    async addProduct(product: GdevStoreProductModel) {
        try {
            var productId: string = product.referencia
                .split(' ')
                .join('-')
                .toLowerCase();
            var dotsSplit = productId.split('.');
            productId = dotsSplit.length == 1 ? productId : dotsSplit.join('_');

            Object.keys(product).forEach((key) => {
                if (product[key] == undefined) delete product[key];
            });
            var productObject = {};
            productObject = { ...productObject, ...product };
            productObject['id'] = productId;

            await this.productsRef.doc(productId).set(productObject);

            if (product.sinonimos) {
                this.saveProductTipo(
                    product.referencia,
                    product.sinonimos,
                    productId
                );
            }

            this._alerts.sendFloatNotification('Producto agregado');

            return true;
        } catch (error) {
            this._alerts.sendError('No se pudo guardar', error);
            console.log(error);
        }
    }

    async saveProductTipo(
        referencia: string,
        sinonimos: string[],
        name: string
    ) {
        try {
            var productClase: Clase = {
                value: referencia,
                synonyms: sinonimos,
            };

            var typesDoc = await this.typesDocRef.get();

            if (typesDoc.exists) {
                console.log('Existen tipo');
                let types = typesDoc.data() as TipoEntidadModel;
                types.entities = [...types.entities, productClase];
                this.typesDocRef.update( { entities: types.entities } );
                this.setProductTypesStatus('created');
            } else {
                console.log('No existen tipos');
                let newTipo: TipoEntidadModel = new TipoEntidadModel(
                    referencia,
                    'KIND_MAP',
                    'AUTO_EXPANSION_MODE_DEFAULT',
                    [productClase],
                    true,
                    name
                );

                console.log(newTipo);
                this.typesDocRef.set({ ...newTipo });
                this.setProductTypesStatus('unsaved');
            }
        } catch (error) {
            console.error(error);
            this._alerts.sendFloatNotification(
                'No se pudo guardar los sinónimos'
            );
        }
    }

    async addProductImage(file) {
        const dateId = new Date().getTime(),
            fileName = `${dateId}-${file.name}`,
            path = `${this.usuario.uid}/products/${fileName}`,
            ref = this.ft.ref(path),
            task = this.ft.upload(path, file);

        await task.percentageChanges().subscribe((res) => {
            return (this.imageLoadPercent = res);
        });

        await task
            .snapshotChanges()
            .pipe(
                finalize(async () => {
                    await ref.getDownloadURL().subscribe((res) => {
                        this.imageUrl.next({ url: res, alt: file.name });
                    });
                    return;
                })
            )
            .subscribe();
    }

    async loadGalleryImage(image) {
        let dateId = new Date().getTime(),
            fileName = `${dateId}-${image.name}`,
            path = `${this.usuario.uid}/products/${fileName}`,
            ref = this.ft.ref(path),
            task = this.ft.upload(path, image);

        await task
            .snapshotChanges()
            .pipe(
                finalize(async () => {
                    await ref.getDownloadURL().subscribe((res) => {
                        this.imageUrl.next({ url: res, alt: image.name });
                    });
                    return;
                })
            )
            .subscribe();
    }

    async getProduct(productId: string) {
        try {
            const productRef = this.productsRef.doc(productId);
            const productDoc = await productRef.get();
            var product = productDoc.data() as GdevStoreProductModel;
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(product: GdevStoreProductModel) {
        try {
            var productObject = {};
            productObject = { ...productObject, ...product };
            console.log(productObject);
            await this.productsRef.doc(product.id).update(productObject);
            let typesDoc = await this.typesDocRef.get();
            var productClase: Clase = {
                value: product.referencia,
                synonyms: product.sinonimos,
            };

            let entities = typesDoc.get('entities');
            entities = [...entities, productClase];
            this.typesDocRef.update({ entities });

            this._alerts.sendFloatNotification('Producto guardado');
            this.setProductTypesStatus('unsaved');
            return true;
        } catch (error) {
            this._alerts.sendMessageAlert('Ups, algo falló. No se guardó');
            console.error(error);
        }
    }

    async onDelAttr(itemAttr) {
        var itemId = itemAttr.idItem,
            itemAttr = itemAttr.attrItem;
        this.productsRef.doc(itemId).update({
            [itemAttr]: firebase.firestore.FieldValue.delete(),
        });
        this._alerts.sendFloatNotification('Producto eliminado');
        return;
    }

    async delProduct(productId: string) {
        try {
            const prodRef = this.productsRef.doc(productId);
            var prodDoc = await prodRef.get();
            var prodName = await prodDoc.get('referencia');
            await prodRef.delete();

            const typeRef = this.usuarioRef
                .collection('config_docs')
                .doc('products_types');
            var products_type = await typeRef.get();
            var entities = products_type.get('entites');
            var entity = entities.findIndex((e) => e.value == prodName);
            entities.splice(entity, 1);
            typeRef.update({ entities: entities });
            this.setProductTypesStatus('unsaved');

            return true;
        } catch (error) {
            console.error(error);
        }
    }

    async setProductTypesStatus(status: 'saved' | 'unsaved' | 'created') {
        const configDocRef = this.usuarioRef
            .collection('config_docs')
            .doc('products_types');

        try {
            configDocRef.update({ status });
            this._alerts.sendFloatNotification(
                `Tipo de datos 'producto' ahora es ${status}`
            );
        } catch (error) {
            console.error(error);
            this._alerts.sendError(
                'Se intentó guardar el tipo de datos de productos y ocurrió un error',
                error
            );
        }
    }
}
