
/**
 * Support class for a Haystack tag
 */
export class HaystackTagModel {

    kind: TagKind;
    name: string;

}

/**
 * Enumeration of all marker kinds
 */
export enum TagKind {
    marker = 0,
    number,
    bool,
    str,
    obj,
    ref
}