export class AgenteModel {
    constructor(
        public project: string,
        public displayName: string,
        public defaultLanguageCode: string,
        public timeZone: string,
        public description?: string,
        public avatarUri?: string,
        public agenteId?: string,
        public clientToken?: string,
        public developerToken?: string,
    ){}

}