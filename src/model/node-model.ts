// Librairies
import { plainToClass } from "class-transformer";

// Models
import { Tag } from "./tag-model";
import { Relation } from "./relation-model";

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

    // Addons
    tags: Tag[] = [];
    relations: Relation[] = [];

    ////////////////////////////////////////////////////////////////
    // Static methods
    ////////////////////////////////////////////////////////////////

    /**
     * Remove specific application attributes which are not necessary in the database
     * @param node
     * @return the conded node
     */
    public static encode(node: Node): Node {
        node.isHidden = undefined;
        node.isFilteredOut = undefined;
        node.isSelected = undefined;
        return node;
    }

    /**
    * Create a deep copy of a node
    * @param node
    * @return the copied node
    */
    public static deepCopy(node: Node): Node {
        return plainToClass(Node, JSON.parse(JSON.stringify(node)) as Object);
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
    public static generateSnapshot(node: Node): NodeSnapshot {
        let snapshot = new NodeSnapshot();
        snapshot.id = node.id;
        snapshot.listIndex = node.listIndex;
        snapshot.name = node.name;
        snapshot.nodeDefIndex = node.nodeDefIndex;
        return snapshot;
    }
}