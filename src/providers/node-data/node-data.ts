// Angular
import { Injectable } from '@angular/core';

// Firestore
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

// Libraries
import { plainToClass } from "class-transformer";

// Models
import { NodeDefinition, NodeDefinitionList, TopNodeDefinitionEnum } from '../../model/node-definition-model';
import { Node, NodeSnapshot } from '../../model/node-model';

// Providers
import { FirestoreProvider } from '../firestore/firestore';
import { NodeHandlerProvider } from '../node-handler/node-handler';

// RxJs
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Utils
import { DataUtil } from '../../utils/data-util';

@Injectable()
export class NodeDataProvider {

  constructor(
    public firestorePvd: FirestoreProvider,
    public nodeHandlerPvd: NodeHandlerProvider) {
  }

  public nodeDefinitions$: Observable<NodeDefinition[]> = Rx.Observable.empty();

  ////////////////////////////////////////////////////////////////
  // Public
  ////////////////////////////////////////////////////////////////

  /**
   * Start a subscription to read the entire list of NodeDefinition and Nodes at the first call
   * Update automatically the nodeDefinitions$ variable at every update
   */
  public loadNodeDefinitions(): void {

    // Read all NodeDefinition
    this.nodeDefinitions$ = this.firestorePvd.readCollection('nodeDefinition', ref => ref.orderBy('index', 'asc'))
      .mergeMap(nodeDefinitions => { // nodeDefinitions: NodeDefinition[]

        // For each nodeDefinition
        let ndfObsArray$: Observable<NodeDefinition>[] = nodeDefinitions.map(nodeDef => { // nodeDef: NodeDefinition

          // Transform the plain object into a NodeDefinition type
          let ndf: NodeDefinition = plainToClass(NodeDefinition, nodeDef as Object);

          if (ndf.lists.length == 0) {
            let list = new NodeDefinitionList();
            for (let id in TopNodeDefinitionEnum) {
              if (ndf.id === id) {
                list.showAddNode = true;
                break;
              }
            }
            ndf.lists.push(list);
          }

          // Get its associated nodes
          let nodeObs$: Observable<NodeDefinition> = this.firestorePvd.readCollection('nodeDefinition/' + ndf.id + '/nodes')
            .map(nodes => { // nodes : Node []

              ndf.lists = [];
              ndf.lists.push(new NodeDefinitionList());

              nodes.map(_node => { // _node : Node

                // Transform the plain object into a NodeType
                let node: Node = plainToClass(Node, _node as Object);

                // Check if the list is already created in the Node Definition. Create it if not
                if (node.listIndex >= ndf.lists.length) {
                  ndf.lists.push(new NodeDefinitionList());
                }
                ndf.lists[node.listIndex].nodes.push(node);

                return node;

              });

              return ndf;

            });

          return nodeObs$;

        });

        // Transform Observable<NodeDefinition>[] in Observable<NodeDefinition[]>
        return Rx.Observable.combineLatest(...ndfObsArray$);

      });

  }

  /**
   * Create a new node and push it to the database
   * @param name 
   * @param nodeDefIndex 
   * @param listIndex
   * @return a void promise
   */
  public createNode(name: string, nodeDefIndex: number, listIndex: number): Promise<void> {

    // Create a new node
    let node = new Node();
    node.id = this.firestorePvd.generateId(); // Generate a new id for this node


    // Update the node
    node.name = name;
    node.nodeDefIndex = nodeDefIndex;
    node.listIndex = listIndex;

    // Generate the isIn relation based on the current selection if the node is not at the uppest level
    if (!(nodeDefIndex == 0 && listIndex == 0)) {
      let parentIsInNode = this.nodeHandlerPvd.getSelectedParentNode(node);
      if (parentIsInNode) {
        node.isIn.push(NodeSnapshot.generateSnapshot(parentIsInNode));

        // Update the contains relation
        parentIsInNode.contains.push(NodeSnapshot.generateSnapshot(node));
        this.updateNode(parentIsInNode);
      }
    }

    const nodeDefinitionId = this.nodeHandlerPvd.getNodeDefinitionId(nodeDefIndex);

    // Push the node to the cloud
    return this.firestorePvd.set(DataUtil.cleanUndefinedValues(Node.encode(node)), 'nodeDefinition/' + nodeDefinitionId + '/nodes/' + node.id);

  }

  /**
   * Update a node
   * @param node 
   * @return a void promise
   */
  public updateNode(node: Node): Promise<void> {
    const nodeDefinitionId = this.nodeHandlerPvd.getNodeDefinitionId(node.nodeDefIndex);
    return this.firestorePvd.set(DataUtil.cleanUndefinedValues(Node.encode(node)), 'nodeDefinition/' + nodeDefinitionId + '/nodes/' + node.id);
  }

  /**
   * Delete a node
   * @param node 
   */
  public deleteNode(node: Node): void {
    const nodeDefinitionId = this.nodeHandlerPvd.getNodeDefinitionId(node.nodeDefIndex);
    this.firestorePvd.delete('nodeDefinition/' + nodeDefinitionId + '/nodes/' + node.id);
  }

  ////////////////////////////////////////////////////////////////
  // Fake methods
  ////////////////////////////////////////////////////////////////

  generateFakeNodes(): Observable<Array<NodeDefinition>> {

    return Observable.create((observer: Observer<Array<NodeDefinition>>) => {

      let nodeDefArray: NodeDefinition[] = [];

      // ND- Category
      let categoryND = new NodeDefinition();
      categoryND.name = 'Category';
      categoryND.treeIndex = 0;
      categoryND.lists = [];
      nodeDefArray.push(categoryND);

      // List 1
      let nodeList1 = new NodeDefinitionList();
      nodeList1.nodes = [];
      categoryND.lists.push(nodeList1);

      // List 2
      let nodeList2 = new NodeDefinitionList();
      nodeList2.nodes = [];
      categoryND.lists.push(nodeList2);

      // L-1 Production chaud
      let node1 = new Node();
      node1.nodeDefIndex = 0;
      node1.listIndex = 0;
      node1.name = 'Production chaud';
      node1.id = 'production_chaud';
      nodeList1.nodes.push(node1);

      // L-2 Sous-station vapeur
      let node2 = new Node();
      node2.nodeDefIndex = 0;
      node2.listIndex = 1;
      node2.name = 'Sous-station vapeur';
      node2.id = 'sous_station_vapeur';
      nodeList2.nodes.push(node2);

      let nodeSnap2 = new NodeSnapshot();
      nodeSnap2.id = node2.id;
      nodeSnap2.nodeDefIndex = 0;
      node1.contains.push(nodeSnap2);

      let nodeSnap1 = new NodeSnapshot();
      nodeSnap1.id = node1.id;
      nodeSnap1.nodeDefIndex = 0;
      node2.isIn.push(nodeSnap1);

      // L2 - Sous-station eau chaude
      node2 = new Node();
      node2.nodeDefIndex = 0;
      node2.listIndex = 1;
      node2.name = 'Sous-station eau chaude';
      node2.id = 'sous-station_eau_chaude';
      nodeList2.nodes.push(node2);

      nodeSnap2 = new NodeSnapshot();
      nodeSnap2.id = node2.id;
      nodeSnap2.nodeDefIndex = 0;
      node1.contains.push(nodeSnap2);

      nodeSnap1 = new NodeSnapshot();
      nodeSnap1.id = node1.id;
      nodeSnap1.nodeDefIndex = 0;
      node2.isIn.push(nodeSnap1);

      // L2 - Traitement de l'eau
      node2 = new Node();
      node2.nodeDefIndex = 0;
      node2.listIndex = 1;
      node2.name = 'Traitement de l eau';
      node2.id = 'traitement_eau';
      nodeList2.nodes.push(node2);

      nodeSnap2 = new NodeSnapshot();
      nodeSnap2.id = node2.id;
      nodeSnap2.nodeDefIndex = 0;
      node1.contains.push(nodeSnap2);

      nodeSnap1 = new NodeSnapshot();
      nodeSnap1.id = node1.id;
      nodeSnap1.nodeDefIndex = 0;
      node2.isIn.push(nodeSnap1);


      // L1 - Production froid
      node1 = new Node();
      node1.nodeDefIndex = 0;
      node1.listIndex = 0;
      node1.name = 'Production froid';
      node1.id = 'production_froid';
      nodeList1.nodes.push(node1);

      // L-2  Traitement de l'eau bis
      node1.contains.push(nodeSnap2);

      nodeSnap1 = new NodeSnapshot();
      nodeSnap1.id = node1.id;
      nodeSnap1.nodeDefIndex = 0;
      node2.isIn.push(nodeSnap1);


      // Equipment
      let equipmentND = new NodeDefinition();
      equipmentND.name = 'Equipment';
      equipmentND.treeIndex = 0;
      equipmentND.lists = [];
      nodeDefArray.push(equipmentND);

      nodeList1 = new NodeDefinitionList();
      nodeList1.nodes = [];
      equipmentND.lists.push(nodeList1);

      // Chaudière
      let node3 = new Node();
      node3.nodeDefIndex = 1;
      node3.listIndex = 0;
      node3.name = 'Chaudière';
      node3.id = 'chaudiere';
      nodeList1.nodes.push(node3);

      let nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[1].nodes[0].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[1].nodes[0].contains.push(nodeSnap3);

      // Echangeur chaud
      node3 = new Node();
      node3.nodeDefIndex = 0;
      node3.listIndex = 0;
      node3.name = 'Echangeur chaud';
      node3.id = 'echangeur_chaud';
      nodeList1.nodes.push(node3);

      // --> Sous-station vapeur
      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[1].nodes[0].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[1].nodes[0].contains.push(nodeSnap3);

      // --> Sous-station eau chaude
      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[1].nodes[1].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[1].nodes[1].contains.push(nodeSnap3);

      // Echangeur froid
      node3 = new Node();
      node3.nodeDefIndex = 0;
      node3.listIndex = 0;
      node3.name = 'Echangeur froid';
      node3.id = 'echangeur_froid';
      nodeList1.nodes.push(node3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[0].nodes[1].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[0].nodes[1].contains.push(nodeSnap3);

      // Pompe
      node3 = new Node();
      node3.nodeDefIndex = 0;
      node3.listIndex = 0;
      node3.name = 'Pompe';
      node3.id = 'pompe';
      nodeList1.nodes.push(node3);

      // --> Traitement de l'eau
      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[1].nodes[2].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[1].nodes[2].contains.push(nodeSnap3);

      // --> Sous-station eau chaude
      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = categoryND.lists[1].nodes[1].id;
      nodeSnap3.nodeDefIndex = 0;
      node3.isIn.push(nodeSnap3);

      nodeSnap3 = new NodeSnapshot();
      nodeSnap3.id = node3.id;
      nodeSnap3.nodeDefIndex = 1;
      categoryND.lists[1].nodes[1].contains.push(nodeSnap3);



      // Type
      let typeND = new NodeDefinition();
      typeND.name = 'Type';
      typeND.treeIndex = 3;
      typeND.lists = [];

      // List 1
      nodeList1 = new NodeDefinitionList();
      nodeList1.nodes = [];
      typeND.lists.push(nodeList1);

      // L-1 Production chaud
      node1 = new Node();
      node1.nodeDefIndex = 3;
      node1.listIndex = 0;
      node1.name = 'Type1';
      node1.id = 'type1';
      nodeList1.nodes.push(node1);

      nodeDefArray.push(typeND);
      observer.next(nodeDefArray);
      observer.complete();

    });


  }

}
