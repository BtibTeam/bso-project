// Models
import { NodeSnapshot, Node } from "./node-model";

/**
 * Support class for representing a NodeDefinition
 */
export class NodeDefinition {

    // General
    public name: string = '';
    public id: string = '';
    public treeIndex: number = -1; // Common id to a single tree

    public lists: NodeDefinitionList[] = [];

}

/**
 * Support class for representing a pointer to a node
 */
export class NodeDefinitionSnapshot {

    // General
    public name: string;
    public id: string;
    public treeIndex: number;

    ////////////////////////////////////////////////////////////////
    // Static methods
    ////////////////////////////////////////////////////////////////

    /**
     * Generate a nodeSnapshot based on the given nodeDefinition
     * @param nodeDefinition
     */
    public static generateSnapshot(node: NodeDefinition): NodeDefinitionSnapshot {
        let snapshot = new NodeDefinitionSnapshot();
        snapshot.name = node.name;
        snapshot.id = node.id;
        snapshot.treeIndex = node.treeIndex;
        return snapshot;
    }
}

export class NodeDefinitionList {

    public nodes: Node[] = [];

    // UI Specific
    //public showAddNode: boolean = false; // Define the visibility of a AddNode button
}

/**
 * Enumeration representing a list of NodeDefinition
 */
export enum TopNodeDefinitionEnum {
    'category',
    'position',
    'resource',
    'type',
    'dimension'
}