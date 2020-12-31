import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GdevStoreProductModel } from '../product.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { GdevStoreProductsService } from '../products.service';
import { Location } from '@angular/common';
import { COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { UserInterface } from '../../../../../admin/auth/auth.service';
import { CacheService } from '../../../../../gdev-tools/cache/cache.service';

@Component({
  selector: 'gdev-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  public product: GdevStoreProductModel
  public imgToLoad: any;
  public precio = [ '$', /[1-9]/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ]
  public categories: any[]
  public usuario: UserInterface
  


  @Output() closeForm: EventEmitter<any> = new EventEmitter()


  constructor (
    public _products: GdevStoreProductsService,
    // private _categorias: GdevStoreCategoriesService,
    public location: Location,
    private _cache: CacheService
  ) {
    this.product = undefined
    this.product = new GdevStoreProductModel( '', 0, false, '', '', [], [])
    this.usuario = this._cache.getDataKey('user')
  }

  async ngOnInit() {
    
    this._products.imageUrl.subscribe( imageUrl => {
      this.product.imagenUrl = imageUrl
    } )
    this._products.galleyImageUrl.subscribe( imageUrl => {
      this.product.galeria.push(imageUrl)
    } )
    
  }

  readonly separatorKeysCodes: number[] = [ COMMA ];

  addSinonimo(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  
    if ((value || '').trim()) {
      this.product.sinonimos.push(value.trim());
    }
  
    if (input) {
      input.value = '';
    }
  }
  
  removeSinonimo(sinonimo: string): void {
    const index = this.product.sinonimos.indexOf(sinonimo);
    if (index >= 0) {
      this.product.sinonimos.splice(index, 1);
    }
  }

  getImageURL(imageURL) {
    this.product.imagenUrl = imageURL
  }



  setStock( e: MatSlideToggleChange ) {
    this.product.onStock = e.checked
  }

  onLoadImg( file ) {
    this.imgToLoad = file.target.files[ 0 ]
    var reader = new FileReader()
    reader.onload = () => {
      var img: any;
      img = document.getElementById( 'imgReferencia' )
      img.src = reader.result
    }
    reader.readAsDataURL( file.target.files[ 0 ] )

    this._products.addProductImage(this.imgToLoad)
  }



  deleteProductImage( image ) {
    this.product.imagenUrl = {}
  }
  
  getImageGallery( gallery ) {
    console.log( gallery );
    this.product.galeria = gallery
  }

  deleteImageGallery( imageURL ) {
    var itemDeleted = this.product.galeria.findIndex(
      img => img.url == imageURL
    )
    this.product.galeria.splice( itemDeleted, 1 )
  }
  
  disableForm(valid: boolean) {
    return this.product.imagenUrl === undefined 
      ? true 
      : valid
  }



  merge( values ) {
    this.product = { ...this.product, ...values }
  }

  onSubmit( ) {
    this._products.addProduct( this.product ).then( () => {
      this.location.back()
    })
  }

  
}
