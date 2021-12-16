class AggregateView extends View {
  constructor(data) {
    super()
    //Should combine it into one data set maybe?
    this.data = joinData(data["renewData"], data["co2Data"], "municipality");
    this.mapData = data["mapData"]
    this.climateLabels = data["climateLabels"]
    this.electionData = data["electionData"]
    const labelX = 'climate'
    const labelY = 'election'
    this.averagePoliticalClimateLabel = calculateAveragePoliticalClimateLabel(this.electionData, this.climateLabels)
  }

  init() {
    const caller = this
    this.scatterPlot = new ScatterPlot("scatterAggregate", this.data, caller, this.averagePoliticalClimateLabel,
        "CO2_per_inhabitant", "CO2 per inhabitant","energy", "Energy")
    this.map = new GeoMap('map_aggr', this.mapData, this, () => {} , this.onClick)
  }

  isSelected = (munName) => {
    return state.selectedMunicipality === munName
  }

  getMunName = (d) => {
    return d.target?.attributes?.municipality_name?.value || null
  }

  onClick = (d) => {
    state.setNewMunicipality(this.getMunName(d))
    state.update()
  }

  highlight = (d) => {
    return state.selectedMunicipality === d.municipality ? 3 : 0
  }

  fill(d) {
    const munName = d.properties.areaName;
    const isSelected = this.isSelected(munName)
    return isSelected ? 'red' : 'blue'
  }

  update() {
    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    }
    this.map.update();
    this.scatterPlot.update()
  }
}