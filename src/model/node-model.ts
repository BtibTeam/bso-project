// Libraries
import { plainToClass } from "class-transformer";

// Models
import { Tag } from "./tag-model";
import { Relation } from "./relation-model";

/**
 * Support class for representing a node
 */
export class Node {

    // General
    public name: string;
    public id: string;
    public description: string;
    public treeIndex: number; // Indicates in which tree the node belongs to
    public nodeDefIndex: number; // Indicates in which NodeDefinition is the node inside a tree
    public listIndex: number; // Indicates in which sublist is the node inside a NodeDefinition

    // Node relations
    public isIn: NodeSnapshot[] = [];
    public contains: NodeSnapshot[] = [];

    // UI specific
    public isHidden: boolean = false;
    public isFilteredOut: boolean = false;
    public isSelected: boolean = false;

    // Addons
    public tags: Tag[] = [];
    public relations: Relation[] = [];

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
 * Support class for representing a pointer to a node
 */
export class NodeSnapshot {

    // General
    public name: string;
    public id: string;
    public treeIndex: number;
    public nodeDefIndex: number;
    public listIndex: number;


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
        snapshot.treeIndex = node.treeIndex;
        snapshot.listIndex = node.listIndex;
        snapshot.name = node.name;
        snapshot.nodeDefIndex = node.nodeDefIndex;
        return snapshot;
    }
}