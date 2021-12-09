class AggregateView extends View {
  constructor(data) {
    super()
    //Should combine it into one data set maybe?
    this.data = joinData(data["renewData"], data["co2Data"], "municipality");
    this.climateLabels = data["climateLabels"]
    this.electionData = data["electionData"]
    this.averagePoliticalClimateLabel = calculateAveragePoliticalClimateLabel(this.electionData, this.climateLabels)

  }

  init() {
    this.scatterPlot = new ScatterPlot("scatterAggregate", this.data, this.averagePoliticalClimateLabel, "CO2_per_inhabitant", "energy")
  }

  update() {
    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    }
  }
}