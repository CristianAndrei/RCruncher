export class KohonenOptions {
    public fields;
    public iterations = 10;
    public learningRate = 0.1;
    public xValue = 1;
    public yValue = 1;

    setFields(fields: any) {
        this.fields = fields;
    }
    createOptions() {
        const options = {};
        options['fields'] = this.fields;
        options['iterations'] = this.iterations;
        options['learningRate'] = this.learningRate;
        return options;
    }
}