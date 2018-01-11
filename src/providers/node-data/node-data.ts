// Framework
import { Injectable } from '@angular/core';

// Models
import { NodeDefinition, NodeDefinitionList } from '../../model/node-definition-model';
import { Node, NodeSnapshot } from '../../model/node-model';

// RxJs
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class NodeDataProvider {

  constructor() {
  }

  ////////////////////////////////////////////////////////////////
  // TODO: Delete
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
