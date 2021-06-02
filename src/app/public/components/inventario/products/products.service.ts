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
import {
  TipoEntidadModel,
  iEntity,
  iEntityType,
} from '../../agentes/agente/tipos/tipo.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GdevStoreProductsService {
  imageUrl: Subject<{}> = new Subject();
  galleyImageUrl: Subject<{}> = new Subject();
  imageLoadPercent;
  usuario: UserInterface;
  tiposRef: firebase.firestore.CollectionReference
  projectId: string
  entityName: string
  private _url = environment.restURL + 'entity';

  constructor(
    private fs: AngularFirestore,
    private ft: AngularFireStorage,
    private _alerts: GdevAlert,
    private _cache: GdevCache,
    private _http: HttpClient
  ) {
    this.usuario = this._cache.getDataKey('user');
  }

  get usuarioRef() {
    return this.fs.doc(`usuarios/${this.usuario.uid}`).ref;
  }

  get productsRef() {
    return this.usuarioRef.collection('productos');
  }

  async getTiposCol() {
    let agentPath;
    var agentsCol = await this.usuarioRef.collection('agentes').get()
    if (agentsCol.size > 0) {
      agentPath = agentsCol.docs[0].ref.path
      this.projectId = agentsCol.docs[0].id
      return this.tiposRef = this.fs.doc(agentPath).collection('tipos').ref
    } else {
      return null
    }
  }

  async productTypeRef() {
    const tiposCol = await this.getTiposCol()
    if (tiposCol) {
      let entityDoc = await tiposCol.where('displayName', '==', 'productos').get()
      if (!entityDoc.empty) {
        this.entityName = entityDoc.docs[0].id
        return entityDoc.docs[0].ref
      } else {
        return null
      }
    } else {
      return null
    }
    // return this.usuarioRef.collection('config_docs').doc('product_types');
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
        this.saveProductTipo(product.referencia, product.sinonimos, productId);
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
    entity: string
  ) {
    try {
      var productClase: iEntity = {
        value: entity,
        synonyms: [
          ...sinonimos.filter(s => s != referencia),
          referencia
        ],
      };

      var typeRef = await this.productTypeRef()


      if (typeRef) {
        var typesDoc = await  typeRef.get()
        console.log('Existen tipo');
        let productType = typesDoc.data() as TipoEntidadModel;
        productType.entities = [
          ...productType.entities.filter(e => e.value != productClase.value),
          productClase
        ];

        this._updateProductEntity(productType)
        await (await this.productTypeRef()).update({ entities: productType.entities })
      } else {
        console.log('No existen tipos');
        let newTipo: iEntityType = new TipoEntidadModel(
          'productos',
          'KIND_MAP',
          'AUTO_EXPANSION_MODE_DEFAULT',
          [productClase],
          true,
        );

        let entity = await this._createProductsEntity(newTipo);
        if (entity) {
          let id = entity.name.slice(entity.name.lastIndexOf('/') + 1)
          newTipo.name = entity.name ;
          let entityPath = `agentes/${this.projectId}/tipos`
          this.usuarioRef.collection(entityPath).doc(id).set({...newTipo})
        }
      }
    } catch (error) {
      console.error(error);
      this._alerts.sendFloatNotification('No se pudo guardar los sinónimos');
    }
  }


/** Crea el entity en el backend */
private _createProductsEntity(
  productsEntity: iEntityType
): Promise<TipoEntidadModel> {
  return new Promise((resolve, reject) => {
    this._http.post(
        `${this._url}/${this.projectId}`,
        { entityType: { ...productsEntity } },
        { responseType: 'json' }
      ).subscribe((result) => {
        if (result['status'] == 'success')  {
          //exito creado
          let entity = result['result']

          resolve(entity);
        } else {
          reject({message: 'No se pudo crear la entidad'})
        }
      }, (err) => {
        if (err) {
          console.error(err);
          this._alerts.sendError(
            'No fué posible crear la entidad de productos.',
            err
          );
        }
        reject(err);
      });
  });
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
      let typesDoc = await (await this.productTypeRef()).get();
      let type = typesDoc.data() as iEntityType
      var productClase: iEntity = {
        value: product.id,
        synonyms: [
          ...product.sinonimos.filter(s => s != product.referencia),
           product.referencia
        ],
      };

      type.entities = [
        ...type.entities.filter(e => e.value != productClase.value),
        productClase
      ];
      this._updateProductEntity(type);
      (await this.productTypeRef()).update({ entities: type.entities });

      this._alerts.sendFloatNotification('Producto guardado');
      return true;
    } catch (error) {
      this._alerts.sendMessageAlert('Ups, algo falló. No se guardó');
      console.error(error);
    }
  }

  /** Actualiza la Entity en el backend */
  private _updateProductEntity(entityType: iEntityType) {
    return new Promise((resolve, reject) => {
      this._http
        .put(this._url, { entityType: entityType })
        .toPromise()
        .then((result) => {
          console.info('Entity updated', result);
          this._alerts.sendFloatNotification('Tipo guardado');
          resolve(true);
        })
        .catch((err) => {
          if (err) {
            console.error(err);
            this._alerts.sendError(
              'No fué posible crear ese Tipo en este momento.',
              err
            );
          }
          reject(err);
        });
    });
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

      const typeRef = await this.productTypeRef()
      var products_type = await typeRef.get();
      var type = products_type.data() as iEntityType
      var entity = type.entities.findIndex((e) => e.value == prodName);
      type.entities.splice(entity, 1);
      this._updateProductEntity(type)
      typeRef.set({ entities: type.entities }, { merge: true });

      return true;
    } catch (error) {
      console.error(error);
    }
  }


  async delEntityProduct() {

  }

  async setProductTypesStatus(status: 'saved' | 'unsaved' | 'created') {
    const configDocRef = this.usuarioRef
      .collection('config_docs')
      .doc('products_types');

    try {
      configDocRef.set({ status }, { merge: true });
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
