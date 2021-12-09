class AggregateView extends View{
	constructor(data) {
		super()
		//Should combine it into one data set maybe?
		this.data = joinData(data["renewData"], data["co2Data"], "municipality");

	}

	init() {
		this.scatterPlot = new ScatterPlot("scatterAggregate", this.data, "CO2_per_inhabitant", "energy")
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
		}
	}
}