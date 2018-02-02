
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

    /**
     * Remove specific application attributes which are not necessary in the database
     * @param node 
     */
    static encode(node: Node): Node {
        node.isHidden = undefined;
        node.isFilteredOut = undefined;
        node.isSelected = undefined;
        return node;
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


    ////////////////////////////////////////////////////////////////
    // Static methods
    ////////////////////////////////////////////////////////////////

    /**
     * Generate a nodeSnapshot based on the given node
     * @param node 
     */
    static generateSnapshot(node: Node): NodeSnapshot {
        let snapshot = new NodeSnapshot();
        snapshot.id = node.id;
        snapshot.listIndex = node.listIndex;
        snapshot.name = node.name;
        snapshot.nodeDefIndex = node.nodeDefIndex;
        return snapshot;
    }
}