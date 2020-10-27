export class Interaction {

    public message: string | QuickResponse[] | Image 
    public emiter?: 'this' | 'that'
    public time: Date

    constructor (
        message: string | QuickResponse[] | Image ,
        emiter: 'this' | 'that'
    ) {
        this.message = message
        this.emiter = emiter
        this.time = new Date()
    }

}

export class ConversationItem {
    constructor (
        public message: string | QuickResponse[] | Image ,
        public emiter?: 'this' | 'that',
        public time?: Date,
    ){}
}

export type MessageType = string | QuickResponse | Image 


export interface QuickResponse {
    displayText: string,
    value: string
}

export interface Image {
    src: string,
    alt: string
}
