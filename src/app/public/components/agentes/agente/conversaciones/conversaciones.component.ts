import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConversacionesService } from './conversaciones.service';
import { UserConversation } from './conversaciones.model';
import { Router } from '@angular/router';

@Component( {
    templateUrl: './conversaciones.component.html',
    styleUrls: [ './conversaciones.component.scss' ]
} )
export class ConversacionesComponent implements OnInit {


    convSelected: UserConversation
    convList: UserConversation[]
    @ViewChild( 'currentConv' ) colPanel: MatDrawer
    @ViewChild('listPanel') listPanel: MatSelectionList
    constructor (
        public convs_: ConversacionesService,
        public _router: Router
  ) { }

    async ngOnInit() {
      this.convList = await this.convs_.list()
    }

    onCloseConversation() {
        this.colPanel.close()
        this.listPanel.deselectAll()
        this.convSelected = {}
    }

    onConversationSelected(selected: MatSelectionListChange) {
        if ( this.colPanel.opened ) { this.colPanel.close() }
        this.convSelected = selected.option.value
        this.colPanel.open()
    }

    deleteConversation( userId: string, event ) {
        event.stopPropagation();
        this.convs_.deleteConversation( userId )
            .then( async () => {
                this.convList = []
                this.convList = await this.convs_.list()
        })
    }

}
