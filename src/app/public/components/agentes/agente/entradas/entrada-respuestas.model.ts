export interface RespuestaEntrada {
    message:
    RespuestaText |
    RespuestaImage |
    RespuestaRapida |
    RespuestaCard |
    RespuestaPayload |
    RespuestaSimples |
    RespuestaSugerencia |
    RespuestaLinkExterno
}

export interface RespuestaText {
    text: string[]
}
export interface RespuestaImage {
    imageUri: string,
    accessibilityText: string
}
export interface RespuestaRapida {
    title: string,
    quickReplies: [
        string
    ]
}
export interface RespuestaCard {
    title: string,
    subtitle?: string,
    imageUri?: string,
    buttons?: CardButton[]
}interface CardButton {
        text?: string,
        postback?: string
}

export interface RespuestaPayload {

}
export interface RespuestaSimples {
    simpleResponses: VoiceOrText[]
}interface VoiceOrText {
        textToSpeech: string,
        ssml: string,
        displayText?: string
    }

export interface RespuestaSugerencia {
    suggestions: Sugerencia[]
}interface Sugerencia {
    title: string
}
export interface RespuestaLinkExterno {
    destinationName: string,
    uri: string
}
