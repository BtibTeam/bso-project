
export abstract class Addon {

    public id: string;
    public description: string; // Short explanation on the tag
    public dictionary: string; // Name of the dictionary where it comes from in camelCase
    public usedWith: string; // ids of Addon to use it with. They must be seprarated by a coma
    
}