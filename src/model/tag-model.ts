// Models
import { Addon } from './addon-model';

export class Tag extends Addon {

    kind: TagKind = 0;

    // Optional
    defaultValue: string = ''; // The default value. TODO: Handle different kinds of default values
    units: string = ''; // TODO: Units nomenclature must follow a standard.

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