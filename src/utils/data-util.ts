export class DataUtil {

    /**
    * Replace every undefined value in an object by a null value
    */
    public static cleanUndefinedValues(obj: any): any {
        return JSON.parse(JSON.stringify(obj, function (k, v) {
            if (v === undefined) { return null; } return v;
        }));
    }
}