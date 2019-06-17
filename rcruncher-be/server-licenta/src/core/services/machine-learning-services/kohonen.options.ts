/*function computeDistanceForArray(firstArray, secondArray) {
    if (firstArray.length !== secondArray.length) {
        return 0;
    }
    let distance;
    let commonNullValues;
    for (let index = 0; index < firstArray.length; index++) {
        if (firstArray[index] === secondArray[index]) {
            commonNullValues++;
        }
    }
    for (let index = 0; index < firstArray.length; index++) {
        distance += commonNullValues * Math.abs(firstArray[index] - secondArray[index]);
    }
    return distance;
}
function computeDistanceForJSON(firstJson, secondJson) {
    const firstArray = Object.values(firstJson);
    const secondArray = Object.values(secondJson);
    return computeDistanceForArray(firstArray, secondArray);
}*/
const czekanowskiDistance = require('ml-distance').distance.czekanowski;
export class KohonenOptions {
    public fields;
    public iterations = 100;
    public learningRate = 0.1;
    public xValue = 100;
    public yValue = 100;
    setFields(fields: any) {
        this.fields = fields;
    }
    createOptions() {
        const options = {};
        options['fields'] = this.fields;
        options['iterations'] = this.iterations;
        options['learningRate'] = this.learningRate;
        options['distance'] = czekanowskiDistance;
        return options;
    }
}