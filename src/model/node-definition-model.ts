// Models
import { NodeSnapshot, Node } from "./node-model";

/**
 * Support class for representing a NodeDefinition
 */
export class NodeDefinition {

    // General
    id: string;
    name: string;
    treeIndex: number; // id commoned to a single tree

    lists: NodeDefinitionList[] = [];

}

export class NodeDefinitionList {

    nodes: Node[] = [];

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