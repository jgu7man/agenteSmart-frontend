import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TipoEntidadModel } from '../tipo.model';
import { TiposService } from '../tipos.service';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'aSmart-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.scss']
})
export class TipoComponent implements OnInit {


  @Input() tipo: TipoEntidadModel
  @ViewChild('tipoPanel') tipoPanel: MatExpansionPanel
  @ViewChild( 'editInput' ) editInput: ElementRef
  // @Output() tipoDeleted = new EventEmitter<string>()
  switchEditTipo: boolean = false


  constructor (
    public tiposService: TiposService,
    private loading: Loading
  ) { }

  ngOnInit(): void {
  }

  async onExpanded(  ) {
    this.switchEditTipo = this.tipoPanel.expanded ? true :  false
    
    await this.loading.waitFor( 200 )
    
    this.switchEditTipo ?
      this.editInput.nativeElement.focus() :
      null;
  }

  // onSave() {
  //   this.tiposService.setTipo(this.tipo)
  // }


  delSpaces( e ) {
    if ( e.which === 32 ) {
      e.stopPropagation();
      return false
    } else if ( e.which === 13 ) {
      e.stopPropagation();
    }

  }

  // onDeleteTipo() {
  //   this.tiposService.deleteTipo( this.tipo.name )
  //     .then(()=> {this.tipoDeleted.emit(this.tipo.name)})
  // }

  

}
