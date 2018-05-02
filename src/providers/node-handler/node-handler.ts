// Framework
import { Injectable } from '@angular/core';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';
import { NodeDefinition, NodeDefinitionList } from '../../model/node-definition-model';

@Injectable()
export class NodeHandlerProvider {

  nodeDefinitions: NodeDefinition[];

  constructor() {
  }

  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  /**
   * Update the internal array of nodeDefinitions (and nodes) for the algorithms to work on
   * @param _nodeDefinitions 
   */
  public setNodeDefinitions(_nodeDefinitions: NodeDefinition[]): void {
    this.nodeDefinitions = _nodeDefinitions;
  }

  /**
   * Update every node when one is selected 
   * @param treeIndex the index of the tree to work one to speed up the algorithm
   */
  public unselectNode(node: Node, treeIndex: number): void {

    let discoveredNodes: Node[] = [];

    // Reset every node hidden state in order to all of them being displayed
    this.updateNodesState(node, [], treeIndex, this.resetHiddenState);

    // Get every selected node
    let selectedNodes = this.getSelectedNodes(treeIndex);

    // For each selected node, re-apply the algorithm to simulate a case where every node is selected one after each other
    selectedNodes.forEach(selectedNode => {
      discoveredNodes = [];
      discoveredNodes.push(selectedNode);

      // Explore isIn and contains relationships to discovered every connected nodes to the selected one
      discoveredNodes = this.findRelatedNodes(treeIndex, selectedNode, discoveredNodes, true, true);

      // Apply the hidden state to every node which is not contained in the discoveredNodes array
      this.updateNodesState(node, discoveredNodes, treeIndex, this.applyHiddenStateToDiscoveredNodes);
    });

    if (node.listIndex != 0) {
      //this.handleNodeAddButtons(node, false);
    }
    // Display the button at the top anyway
    //this.nodeDefinitions[0].lists[0].showAddNode = true;

  }

  /**
   * Unselect every node 
  */
  public unselectAllNodes(): void {
    for (const nodeDef of this.nodeDefinitions) {
      for (const list of nodeDef.lists) {
        for (let node of list.nodes) {
          node.isFilteredOut = false;
          node.isHidden = false;
          node.isSelected = false;
        }
      }
    }
  }

  /**
   * Update every node when one is unselected 
   * @param node the unselected node
   * @param treeIndex the index of the tree to work one to speed up the algorithm
   */
  public selectNode(node: Node, treeIndex: number): void {

    let discoveredNodes: Node[] = [];
    discoveredNodes.push(node);

    // Explore isIn and contains relationships to discovered every connected nodes to the selected one
    discoveredNodes = this.findRelatedNodes(treeIndex, node, discoveredNodes, true, true);

    // Apply the hidden state to every node which is not contained in the discoveredNodes array
    this.updateNodesState(node, discoveredNodes, treeIndex, this.applyHiddenStateToDiscoveredNodes);

    // Auto-select every single displayed node only if they are from a higher level than the selected Node
    this.updateNodesState(node, discoveredNodes, treeIndex, this.autoSelectNodes, this.isLowerLevelNodes);

    //this.handleNodeAddButtons(node, true);
  }
  /**
   * Return the selected node among either the first parent list
   * or if it is the first list among the last list of the parent NodeDefinition
   * Return null otherwise
   * @param node
   * @return the selected parent node
   */
  public getSelectedParentNode(node: Node): Node {

    // Search among the direct parent inside its own NodeDefinition
    for (let i = node.listIndex - 1; i >= 0; i--) {
      const list = this.nodeDefinitions[node.nodeDefIndex].lists[i];
      for (const _node of list.nodes) {
        if (_node.isSelected)
          return _node;
      }
    }

    // We didn't find it in the same NodeDefinition. We try in the parent NodeDefinition
    for (let i = node.nodeDefIndex - 1; i >= 0; i--) {
      const nodeDef = this.nodeDefinitions[i];
      for (let j = nodeDef.lists.length - 1; j >= 0; j--) {
        const list = this.nodeDefinitions[i].lists[j];
        for (const _node of list.nodes) {
          if (_node.isSelected)
            return _node;
        }
      }
    }

    // We did not find any selected node. This case shouldn't happen --> UI issue
    return null;
  }

  ////////////////////////////////////////////////////////////////
  // Internal methods
  ////////////////////////////////////////////////////////////////

  /**
   * Browse every node of the given tree index and perform the given function on each of them
   * @param referenceNode
   * @param discoveredNodes 
   * @param treeIndex 
   * @param stateFunction 
   */
  private updateNodesState(referenceNode: Node, discoveredNodes: Node[], treeIndex: number, stateFunction: Function, filterFunction?: Function) {

    // Browse all nodeDefinition
    for (let nodeDef of this.nodeDefinitions) {

      // Exclude NodeDefinitions that are not in this tree index
      // (They cannot contain isIn or contains relationships with the selected one)
      if (nodeDef.treeIndex != treeIndex) {
        continue;
      }

      // Browse all lists
      for (let list of nodeDef.lists) {

        // Browse all nodes
        for (let node of list.nodes) {
          stateFunction(referenceNode, discoveredNodes, node, filterFunction);
        }
      }

    }
  }

  /*handleNodeAddButtons(node: Node, selected: boolean) {
    // Handle the add node button appearance on next lists
    if (this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex + 1]) {
      this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex].showAddNode = selected;
    }
    if (this.nodeDefinitions[node.nodeDefIndex + 1]) {
      this.nodeDefinitions[node.nodeDefIndex + 1].lists[0].showAddNode = selected;
    }
  }*/

  ////////////////////////////////////////////////////////////////
  // State functions
  ////////////////////////////////////////////////////////////////

  /**
   * Apply the hidden state if the given node is contained in the given discoveredNodes array
   * @param referenceNode
   * @param discoveredNodes 
   * @param node 
   */
  private applyHiddenStateToDiscoveredNodes = (referenceNode: Node, discoveredNodes: any, node: any) => {
    if (discoveredNodes.length > 0) {
      // Check if it is not one of the discovered nodes
      if (discoveredNodes.indexOf(node) === -1) {
        node.isHidden = true;
      }
    }
  }

  /**
   * Reset the hidden states of the given node
   * @param referenceNode
   * @param discoveredNodes 
   * @param node 
   */
  private resetHiddenState = (referenceNode: Node, discoveredNodes: Node[], node: Node) => {
    node.isHidden = false;
    //this.handleNodeAddButtons(node, false);
  }

  /**
   * Auto-select the given node if it's the only one displayed among its siblings
   * @param referenceNode
   * @param discoveredNodes 
   * @param node
   * @param filterFunction
   */
  private autoSelectNodes = (referenceNode: Node, discoveredNodes: Node[], node: Node, filterFunction?: Function) => {
    if (filterFunction) {
      if (filterFunction(referenceNode, node) === true)
        return;
    }
    if (!node.isHidden) {
      if (this.isSingleSiblingsDisplayed(node)) {
        node.isSelected = true;
        //this.handleNodeAddButtons(node, true);
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // Filter functions
  ////////////////////////////////////////////////////////////////

  /**
   * Check whether the Node is from a lower or upper Level than the reference one
   * @param referenceNode 
   * @param node
   * @return true if the Node is from a lower level in the isIn hierarchy
   */
  private isLowerLevelNodes: Function = (referenceNode: Node, node: Node): boolean => {
    if (node.nodeDefIndex === referenceNode.nodeDefIndex) {
      if (node.listIndex > referenceNode.listIndex) {
        return true;
      }
    } else if (node.nodeDefIndex > referenceNode.nodeDefIndex)
      return true;
    return false;
  }

  ////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////

  /**
   * Return all selected nodes of a given tree
   * @param treeIndex 
   */
  private getSelectedNodes(treeIndex: number): Node[] {

    let nodes: Node[] = [];

    for (let nodeDef of this.nodeDefinitions) {
      if (nodeDef.treeIndex != treeIndex) {
        continue;
      }

      // Browse all nodes
      for (let list of nodeDef.lists) {
        for (let node of list.nodes) {
          if (node.isSelected) {
            nodes.push(node);
          }
        }
      }
    }
    return nodes;
  }

  /**
   * Exploration algorithm for discovering every node which is not already hidden by following isIn and contains relationships
   * @param treeIndex The graph index
   * @param referenceNode The node from which the exploration is based
   * @param discoveredNodes An array of nodes to be discovered. Return the same array.
   * @param isIn whether to activate the exploration through isIn relationships 
   * @param contains whether to activate the exploration through contains relationships
   */
  private findRelatedNodes(treeIndex: number, referenceNode: Node, discoveredNodes: Node[], isIn: boolean, contains: boolean): Node[] {
    if (isIn) {
      // Browse every isIn relationships between nodes
      referenceNode.isIn.forEach(nodeSnap => {

        // Get the relative node
        let node: Node = this.getNode(treeIndex, nodeSnap);
        if (node != null) {

          // Add the node
          discoveredNodes.push(node);

          // Check if the node is not already hidden (by a previous selection)
          if (!node.isHidden) {

            // Call itself to discover more nodes
            discoveredNodes.concat(this.findRelatedNodes(treeIndex, node, discoveredNodes, true, false));

          }
        }
      });
    }
    if (contains) {
      // Same algorithm for contains relationships
      referenceNode.contains.forEach(nodeSnap => {

        let node: Node = this.getNode(treeIndex, nodeSnap);
        if (node != null) {
          discoveredNodes.push(node);

          if (!node.isHidden) {

            // Call itself to discover more nodes
            discoveredNodes.concat(this.findRelatedNodes(treeIndex, node, discoveredNodes, false, true));

          }
        }
      });
    }

    return discoveredNodes;
  }

  /**
   * Check whether one of the given node siblings is selected
   * @param node 
   */
  private isSiblingSelected(node: Node): boolean {
    if (node.isSelected) {
      return true;
    }
    for (let _node of this.getNodeDefinition(node.treeIndex, node.nodeDefIndex).lists[node.listIndex].nodes) {
      if (_node.isSelected) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check whether the node is the only given node is displayed among its siblings
   * @param node 
   */
  private isSingleSiblingsDisplayed(node: Node): boolean {
    for (let _node of this.getNodeDefinition(node.treeIndex, node.nodeDefIndex).lists[node.listIndex].nodes) {
      if (!_node.isHidden && node !== _node) {
        return false;
      }
    }
    return true;
  }

  /**
   * Return the NodeDefinition id based on the given index
   * @param index 
   */
  public getNodeDefinitionId(treeIndex: number, nodeDefIndex: number): string {
    const nodeDefinition: NodeDefinition = this.getNodeDefinition(treeIndex, nodeDefIndex);
    if (nodeDefinition) {
      return nodeDefinition.id;
    }
    return null;
  }

  /**
   * Return a NodeDefinition among the list based on its indexes
   * @param treeIndex 
   * @param nodeDefIndex 
   */
  private getNodeDefinition(treeIndex: number, nodeDefIndex: number): NodeDefinition {
    return this.nodeDefinitions.find((nodeDef: NodeDefinition, index: number) => {
      return nodeDef.treeIndex === treeIndex && nodeDef.index === nodeDefIndex;
    });
  }

  /**
   * Return a node based on a nodeSnapshot
   * Return null if it didn't find the node
   * @param treeIndex
   * @param nodeSnap 
   */
  private getNode(treeIndex: number, nodeSnap: NodeSnapshot): Node {

    // Browse all lists
    const nodeDefinition: NodeDefinition = this.getNodeDefinition(treeIndex, nodeSnap.nodeDefIndex);
    if (nodeDefinition) {
      for (let list of nodeDefinition.lists) {

        // Browse all nodes
        for (let node of list.nodes) {

          // Check if ids match
          if (node.id === nodeSnap.id) {
            return node;
          }
        }
      }
    }
    return null;
  }

}
