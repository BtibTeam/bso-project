// Models
import { TopNodeDefinitionEnum } from '.././/model/node-definition-model';

export class ListUtil {

    /**
     * Parse the TopNodeDefinitionEnum enumeration and return a list of its values as an array of string
     */
    public static buildTopNodeDefinitionList(): string[] {
        let list: string[] = [];
        for (let item in TopNodeDefinitionEnum) {
            if (isNaN(Number(item))) {
                list.push(item);
            }
        }
        return list;
    }

    /**
     * Identify the top node definition index among the TopNodeDefinitionEnum based on a nodeDefinition name
     * @param nodeDefinition 
     */
    public static getTopNodeDefTreeIndex(nodeDefinition: string): number {
        let index = 0;
        for (let item in TopNodeDefinitionEnum) {
            if (item === nodeDefinition) {
                return index - 6; // The first 5 indexes are numbers and not strings
            }
            ++index;
        }
    }
}