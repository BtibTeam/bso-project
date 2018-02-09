// Models
import { Addon } from './addon-model';

export class Tag extends Addon {

    public kind: TagKind = 0;

    // Optional
    public defaultValue: string = ''; // The default value. TODO: Handle different kinds of default values
    public units: string = ''; // TODO: Units nomenclature must follow a standard.

}

/**
 * Enumeration of all marker kinds
 */
export enum TagKind {
    marker = 0,
    number,
    bool,
    str,
    list,
    obj,
    ref
}