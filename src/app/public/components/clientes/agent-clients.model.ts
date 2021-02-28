import { UserConversation, Interaction } from '../agentes/agente/conversaciones/conversaciones.model';

export class AgentClient implements UserConversation {

    conversation: Interaction[]

    constructor (
        public userId?: string,
        public messengerId?: string,
        public whatsappId?: string,
        public name?: string,
        public photoURL?: string,
    ) {
        this.conversation = []
     }

}
