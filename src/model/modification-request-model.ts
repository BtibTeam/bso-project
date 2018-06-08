
export class ModificationRequest {

    public id: string = '';
    public originalNodeId: string = '';
    public originalNodeName: string = ''; 
    public publicId: string = ''; // BSO-xxx
    public timestamp: Date = new Date();
    public subject: RequestSubjectEnum = -1;
    public language: string = 'en';
    public newLanguage: boolean = false;
    public field: string = '';
    public value1: string = '';
    public value2: string = '';

}

export enum RequestSubjectEnum {
    general = 0,
    relation,
    translation,
    sourceTags,
    sourceRelations
}

export enum RelationChangeEnum {
    addRelation = 0,
    deleteRelation = 1,
}

