import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Interaction, UserConversation } from '../conversaciones.model';
import { ConversacionesService } from '../conversaciones.service';

@Component({
  selector: 'aSmart-conversacion',
  templateUrl: './conversacion.component.html',
  styleUrls: ['./conversacion.component.scss']
})
export class ConversacionComponent implements OnInit {


    @Input() conversacion: UserConversation;
    @Output() close = new EventEmitter<any>()
    interacciones: Interaction[]
    constructor (
      public conversaciones: ConversacionesService
  ) { }

    async ngOnInit() {
        if ( this.conversacion ) {
          this.interacciones = this.conversacion.conversation
      }
    }

    saveAsTrainingPhrase( convId: string, intentId: string, text: string) {

        const updateBody = {
            userId: this.conversacion.userId,
            convId, intentId, text
        }

        const InterChecked = this.interacciones.findIndex(i => i['id'] === convId)
        this.conversaciones.addTraningPhrase( updateBody )
            .then( () => {
                this.interacciones[InterChecked]['checked'] = true
            })
    }


    setChecked( userId: string, interId: string ) {
        const InterChecked = this.interacciones.findIndex(i => i['id'] === interId)
        this.conversaciones.setInteractionChecked( userId, interId )
            .then( () => {
            this.interacciones[InterChecked]['checked'] = true
        })
    }

}
