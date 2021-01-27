export interface WhatsappStatus {
    status:'DISCONNECTED' | 'CONNECTED'
    qr?: string,
    session?: any
    disconnected?: any
}