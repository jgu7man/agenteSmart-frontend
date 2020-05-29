export class EventHistoryModel {
    constructor (
        public col: string,
        public doc: string,
        public type: 'create' | 'update' | 'delete',
        public head: string,
        public body?: string 
    ) {
        
    }
}