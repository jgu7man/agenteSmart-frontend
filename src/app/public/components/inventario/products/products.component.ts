// import { GdevStoreCategoriesService } from './../categories/categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GdevStoreProductModel } from './product.model';
import { GdevIndexService } from 'src/app/Gdev-Tools/query-index/gdev-index.service';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { UserInterface } from '../../../../admin/auth/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: GdevStoreProductModel[]
  prodSelected: GdevStoreProductModel
  categories: string[] = []
  usuario: UserInterface

  @ViewChild( 'currentProduct' ) productPanel: MatDrawer
  @ViewChild( 'listPanel' ) listPanel: MatSelectionList
  
  


  constructor (
    // private _categories: GdevStoreCategoriesService,
    public _index: GdevIndexService,
    private _cache: CacheService
  ) {
    this.usuario = this._cache.getDataKey('user')
  }
  
  ngOnInit() {
    this.loadProducts()
    // this.loadCategories()
    
  }



  async reloadProducts() {
    this.products = []
    console.log(this.products);
    this.loadProducts()
  }

  // async loadCategories() {
  //   var categories = await this._categories.loadCategories()
  //   categories.forEach( category => {
  //     this.categories.push(category.name)
  //   })
  // }

  

  async loadProducts() {
    this._index.initIndex( `usuarios/${this.usuario.uid}/productos`, 'id', 10 )
    this._index.queryData.subscribe( data => {
      this.products = data
    } )
    this._index.loadingQuery.subscribe( resp => {
      if ( resp ) {
        this.products = []
      } 
    } )
    return
  }

  onProdSelected( selected: MatSelectionListChange ) {
    if ( this.productPanel.opened ) { this.productPanel.close() }
    this.prodSelected = selected.option.value
    this.productPanel.open()
  }

  onClosePanel() {
    this.productPanel.close()
    this.listPanel.deselectAll()
    this.prodSelected = undefined
  }

  

}
