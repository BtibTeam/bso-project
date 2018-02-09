// Models
import { NodeSnapshot, Node } from "./node-model";

/**
 * Support class for representing a NodeDefinition
 */
export class NodeDefinition {

    // General
    public id: string;
    public name: string;
    public treeIndex: number; // id commoned to a single tree

    public lists: NodeDefinitionList[] = [];

}

export class NodeDefinitionList {

    public nodes: Node[] = [];

    // UI Specific
    public showAddNode: boolean; // Define the visibility of a AddNode button
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