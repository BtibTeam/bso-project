
export abstract class Addon {

    id: string;
    description: string; // Short explanation on the tag
    dictionary: string; // Name of the dictionary where it comes from in camelCase
    usedWith: string; // ids of Addon to use it with. They must be seprarated by a coma
    
}