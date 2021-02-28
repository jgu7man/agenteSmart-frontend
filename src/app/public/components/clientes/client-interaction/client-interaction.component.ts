import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AgentClient } from '../agent-clients.model';
import { AgentClientsService } from '../agent-clients.service';

@Component({
    selector: 'aSmart-client-interaction',
    templateUrl: './client-interaction.component.html',
    styleUrls: ['./client-interaction.component.scss'],
})
export class ClientInteractionComponent implements OnInit {
    @Input() client: AgentClient;
    @Output() close = new EventEmitter<any>();
    constructor (
        public clients_: AgentClientsService
    ) { }

    async ngOnInit() {
        if (this.client) {
            this.client.conversation = await this.clients_.getConversation(
                this.client.userId
            )
            console.log( this.client.conversation )
        }
    }

    setPhotoProfile( url: string ) {
        return url ? `url(${url})` : "url('https://st3.depositphotos.com/1156795/34887/v/600/depositphotos_348878322-stock-illustration-profile-placeholder-image-gray-silhouette.jpg')"
    }


    deleteUser() {
        this.clients_.deleteConversation(this.client.userId)
    }
}
