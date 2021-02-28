import { AgentClientsService } from './agent-clients.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { AgentClient } from './agent-clients.model';

@Component({
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {


    clientSelected: AgentClient
    clientsList: AgentClient[]
    @ViewChild( 'currentClient' ) colPanel: MatDrawer
    @ViewChild('listPanel') listPanel: MatSelectionList
    constructor (
      public clients_: AgentClientsService
  ) { }

    async ngOnInit() {
        this.clientsList = await this.clients_.list()
  }

  onCloseClient() {
    this.colPanel.close()
    this.listPanel.deselectAll()
    this.clientSelected = new AgentClient('','','','','')
}

onClientSelected(selected: MatSelectionListChange) {
    if ( this.colPanel.opened ) { this.colPanel.close() }
    this.clientSelected = selected.option.value
    this.colPanel.open()
}

}
