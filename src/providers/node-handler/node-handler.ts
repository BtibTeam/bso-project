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
  setNodeDefinitions(_nodeDefinitions: NodeDefinition[]) {
    this.nodeDefinitions = _nodeDefinitions;
  }

  /**
   * Update every node when one is selected 
   * @param treeIndex the index of the tree to work one to speed up the algorithm
   */
  unselectNode(node: Node, treeIndex: number) {

    let discoveredNodes: Node[] = [];

    // Reset every node hidden state in order to all of them being displayed
    this.updateNodesState([], treeIndex, this.resetHiddenState);

    // Get every selected node
    let selectedNodes = this.getSelectedNodes(treeIndex);

    // For each selected node, re-apply the algorithm to simulate a case where every node is selected one after each other
    selectedNodes.forEach(selectedNode => {
      discoveredNodes = [];
      discoveredNodes.push(selectedNode);

      // Explore isIn and contains relationships to discovered every connected nodes to the selected one
      discoveredNodes = this.findRelatedNodes(selectedNode, discoveredNodes, true, true);

      // Apply the hidden state to every node which is not contained in the discoveredNodes array
      this.updateNodesState(discoveredNodes, treeIndex, this.applyHiddenStateToDiscoveredNodes);
    });

    if(node.listIndex != 0){
      this.handleNodeAddButtons(node, false);
    }
    // Display the button at the top anyway
    this.nodeDefinitions[0].lists[0].showAddNode = true;

  }

  /**
   * Update every node when one is unselected 
   * @param node the unselected node
   * @param treeIndex the index of the tree to work one to speed up the algorithm
   */
  selectNode(node: Node, treeIndex: number) {

    let discoveredNodes: Node[] = [];
    discoveredNodes.push(node);

    // Explore isIn and contains relationships to discovered every connected nodes to the selected one
    discoveredNodes = this.findRelatedNodes(node, discoveredNodes, true, true);

    // Apply the hidden state to every node which is not contained in the discoveredNodes array
    this.updateNodesState(discoveredNodes, treeIndex, this.applyHiddenStateToDiscoveredNodes);

    // Auto-select every single displayed node
    this.updateNodesState(discoveredNodes, treeIndex, this.autoSelectNodes);

    this.handleNodeAddButtons(node, true);
  }
  /**
   * Return the selected node among either the first parent list
   * or if it is the first list among the last list of the parent NodeDefinition
   * Return null otherwise
   * @param node
   */
  getSelectedParentNode(node: Node) {

    // Search among the direct parent inside its own NodeDefinition
    if (node.listIndex > 0) {
      for (let _node of this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex - 1].nodes) {
        if (_node.isSelected)
          return _node;
      }
    } else if (node.nodeDefIndex > 0) { // We didn't not find it in the same NodeDefinition. We try in the parent NodeDefinition
      let lastListIndex = this.nodeDefinitions[node.nodeDefIndex - 1].lists.length - 1;
      for (let _node of this.nodeDefinitions[node.nodeDefIndex - 1].lists[lastListIndex].nodes) {
        if (_node.isSelected)
          return _node;
      }
    }

    // We did not find any selected node. This case shouldn't happen --> UI issue
    return null;
  }

  /**
   * Return the NodeDefinition id based on the given index
   * @param index 
   */
  getNodeDefinitionId(index: number): string {
    return this.nodeDefinitions[index].id;
  }

  ////////////////////////////////////////////////////////////////
  // Internal methods
  ////////////////////////////////////////////////////////////////

  /**
   * Browse every node of the given tree index and perform the given function on each of them
   * @param discoveredNodes 
   * @param treeIndex 
   * @param stateFunction 
   */
  private updateNodesState(discoveredNodes: Node[], treeIndex: number, stateFunction: Function) {

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
          stateFunction(discoveredNodes, node);
        }
      }

    }
  }

  handleNodeAddButtons(node: Node, selected: boolean) {
    // Handle the add node button appearance on next lists
    if (this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex + 1]) {
      this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex].showAddNode = selected;
    }
    if (this.nodeDefinitions[node.nodeDefIndex + 1]) {
      this.nodeDefinitions[node.nodeDefIndex + 1].lists[0].showAddNode = selected;
    }
  }

  ////////////////////////////////////////////////////////////////
  // State functions
  ////////////////////////////////////////////////////////////////

  /**
   * Apply the hidden state if the given node is contained in the given discoveredNodes array
   * @param discoveredNodes 
   * @param node 
   */
  private applyHiddenStateToDiscoveredNodes = (discoveredNodes: any, node: any) => {
    if (discoveredNodes.length > 0) {
      // Check if it is not one of the discovered nodes
      if (discoveredNodes.indexOf(node) == -1) {
        node.isHidden = true;
      }
    }
  }

  /**
   * Reset the hidden states of the given node
   * @param discoveredNodes 
   * @param node 
   */
  private resetHiddenState = (discoveredNodes: Node[], node: Node) => {
    node.isHidden = false;
    this.handleNodeAddButtons(node, false);
  }

  /**
   * Auto-select the given node if it's the only one displayed among its siblings
   * @param discoveredNodes 
   * @param node 
   */
  private autoSelectNodes = (discoveredNodes: Node[], node: Node) => {
    if (!node.isHidden) {
      if (this.isSingleSiblingsDisplayed(node)) {
        node.isSelected = true;
        this.handleNodeAddButtons(node, true);
      }
    }
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
   * @param referenceNode The node from which the exploration is based
   * @param discoveredNodes An array of nodes to be discovered. Return the same array.
   * @param isIn whether to activate the exploration through isIn relationships 
   * @param contains whether to activate the exploration through contains relationships
   */
  private findRelatedNodes(referenceNode: Node, discoveredNodes: Node[], isIn: boolean, contains: boolean): Node[] {
    if (isIn) {
      // Browse every isIn relationships between nodes
      referenceNode.isIn.forEach(nodeSnap => {

        // Get the relative node
        let node: Node = this.getNode(nodeSnap);
        if (node != null) {

          // Add the node
          discoveredNodes.push(node);

          // Check if the node is not already hidden (by a previous selection)
          if (!node.isHidden) {

            // Call itself to discover more nodes
            discoveredNodes.concat(this.findRelatedNodes(node, discoveredNodes, true, false));

          }
        }
      });
    }
    if (contains) {
      // Same algorithm for contains relationships
      referenceNode.contains.forEach(nodeSnap => {

        let node: Node = this.getNode(nodeSnap);
        if (node != null) {
          discoveredNodes.push(node);

          if (!node.isHidden) {

            // Call itself to discover more nodes
            discoveredNodes.concat(this.findRelatedNodes(node, discoveredNodes, false, true));

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
    for (let _node of this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex].nodes) {
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
    for (let _node of this.nodeDefinitions[node.nodeDefIndex].lists[node.listIndex].nodes) {
      if (!_node.isHidden && node !== _node) {
        return false;
      }
    }
    return true;
  }


  /**
   * Return a node based on a nodeSnapshot
   * Return null if it didn't find the node
   * @param nodeDefIndex
   * @param nodeSnap 
   */
  private getNode(nodeSnap: NodeSnapshot): Node {

    // Browse all lists
    for (let list of this.nodeDefinitions[nodeSnap.nodeDefIndex].lists) {

      // Browse all nodes
      for (let node of list.nodes) {

        // Check if ids match
        if (node.id === nodeSnap.id) {
          return node;
        }
      }
    }
    return null;
  }

}
