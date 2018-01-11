
/**
 * Support class for representing a node
 */
export class Node {

    // General
    name: string;
    id: string;
    description: string;
    nodeDefIndex: number;
    listIndex: number;

    // Node relations
    isIn: NodeSnapshot[] = [];
    contains: NodeSnapshot[] = [];

    // UI specific
    isHidden: boolean = false;
    isFilteredOut: boolean = false;
    isSelected: boolean = false;

    printStates() {
        console.log('isHidden: ' + this.isHidden + '; isSelected: ' + this.isSelected + '; isFilteredOut: ' + this.isFilteredOut);
    }
}

/**
 * Support class for representing a NodeGroup
 */
export class NodeGroup extends Node {

    // Node relations
    has: NodeSnapshot[];
    belongsTo: NodeSnapshot[];

}

/**
 * Support class for representing a pointer to a node
 */
export class NodeSnapshot {

    // General
    name: string;
    id: string;
    nodeDefIndex: number;
    listIndex: number;
}