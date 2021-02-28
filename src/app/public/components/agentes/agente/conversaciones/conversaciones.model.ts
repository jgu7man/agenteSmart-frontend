export interface UserConversation {
    userId?: string,
    messengerId?: string,
    whatsappId?: string
    lastUpdate?: Date,
    conversation?: Interaction[]
}

export interface Interaction {
    usuario: string,
    agente: string[]
    intent: IntentInteraction,
    checked: boolean
    time: Date
}

export interface IntentInteraction {
    intentId: string,
    intentName: string
}
