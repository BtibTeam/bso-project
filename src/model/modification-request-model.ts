
export class ModificationRequest {

    public id: string = '';
    public timestamp: Date = new Date();
    public object: RequestObjectEnum = -1;
    public language: string = 'en';
    public newLanguage: boolean = false;
    public field: string = '';
    public value1: string = '';
    public value2: string = '';

}

export enum RequestObjectEnum {
    general = 0,
    relation,
    translation,
    addOn
}

