// Models
import { NodeSnapshot } from './node-model';
import { Node } from './node-model';

/**
 * Support class for representing a node
 */
export class NodeGroup extends Node {

    // General
    public isNodeGroup: boolean = true;

    // NodeGroup relations
    public has: NodeSnapshot[] = [];
    public belongsTo: NodeSnapshot[];

}