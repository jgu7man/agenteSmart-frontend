import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { GdevStoreProductModel } from '../product.model';
import { GdevStoreProductsService } from '../products.service';
import { Router } from '@angular/router';
// import { GdevStoreCategoriesService } from '../../categories/categories.service';
import { Location } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { DelProdcutComponent } from '../del-prodcut/del-prodcut.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA } from '@angular/cdk/keycodes';
import { CacheService } from '../../../../../gdev-tools/cache/cache.service';
import { UserInterface } from '../../../../../admin/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gdev-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnDestroy {

  @Input() public product: GdevStoreProductModel

  
  public imgToLoad: any;
  public precio = [ '$', /[1-9]/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ]
  public categories: any[]
  public usuario: UserInterface
  
  @Output() closeForm: EventEmitter<any> = new EventEmitter()
  DeleteDialogSub: Subscription
  
  constructor (
    public _products: GdevStoreProductsService,
    // private _categorias: GdevStoreCategoriesService,
    public location: Location,
    private _dialog: MatDialog,
    private router: Router,
    private _cache: CacheService
  ) {
    this.product = undefined
    this.product = new GdevStoreProductModel( '', 0, false, '', '', [], [])
    this.usuario = this._cache.getDataKey( 'user' )
  }

  async ngOnInit() {
    // this.categories = await this._categorias.loadCategories()

    this._products.imageUrl.subscribe( imageUrl => {
      this.product.imagenUrl = imageUrl
    } )
    this._products.galleyImageUrl.subscribe( imageUrl => {
      this.product.galeria.push( imageUrl )
    } )


    
    
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

    this._products.addProductImage( this.imgToLoad )
  }

  setGallery( images ) {
    let files: any[] = images.value
    files.forEach( async image => {
      let currentFile = this.product.galeria.find( img => img.alt == image.name )
      if ( !currentFile ) {
        this._products.loadGalleryImage( image )
      }
    } );
  }

  getImageURL( imageURL ) {
    this.product.imagenUrl = imageURL
  }

  deleteProductImage(image) {
    this.product.imagenUrl  = {}
  }
  
  getImageGallery( gallery ) {
    console.log(gallery);
    this.product.galeria = gallery
  }

  deleteImageGallery(imageURL) {
    var itemDeleted = this.product.galeria.findIndex(
      img => img.url == imageURL
    )
    this.product.galeria.splice(itemDeleted, 1)
  }


  onDelete() {
    var dialog = this._dialog.open( DelProdcutComponent, {
      minWidth: 320,
      data: this.product.id
    } )
    
    this.DeleteDialogSub = dialog.afterClosed()
      .subscribe( ( response ) => {
        if(response) this.closeForm.emit()
      } )
  }

  readonly separatorKeysCodes: number[] = [ COMMA ];

  addSinonimo( event: MatChipInputEvent ): void {
    const input = event.input;
    const value = event.value;

    if ( ( value || '' ).trim() ) {
      this.product.sinonimos.push( value.trim() );
    }

    if ( input ) {
      input.value = '';
    }
  }

  removeSinonimo( sinonimo: string ): void {
    const index = this.product.sinonimos.indexOf( sinonimo );
    if ( index >= 0 ) {
      this.product.sinonimos.splice( index, 1 );
    }
  }

  merge( values ) {
    this.product = { ...this.product, ...values }
  }

  onSubmit() {
    this._products.updateProduct( this.product ).then( () => {
      this.closeForm.emit()
    } )
  }


  ngOnDestroy() {
    if (this.DeleteDialogSub) this.DeleteDialogSub.unsubscribe()
  }
}
