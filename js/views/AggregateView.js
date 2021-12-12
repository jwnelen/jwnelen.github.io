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

    this.state = {
      selectedMunicipalities: []
    }
  }

  init() {
    const scatterPlot = new ScatterPlot("scatterAggregate", this.data, this.averagePoliticalClimateLabel,
        "CO2_per_inhabitant", "CO2 per inhabitant","energy", "Energy")
    this.map = new GeoMap('map_aggr', this.mapData, this, undefined , this.onClick)
  }

  isSelected = (munName) => {
    return this.state.selectedMunicipalities.includes(munName)
  }

  getMunName = (d) => {
    return d.target?.attributes?.municipality_name?.value || null
  }

  onClick = (d) => {
    const munName = this.getMunName(d)
    const muns = this.state.selectedMunicipalities
    console.log('clicked', munName, muns);
    if (this.isSelected(munName)) {
      muns.splice(muns.indexOf(munName), 1)
    } else {
      this.state.selectedMunicipalities.push(munName)
    }
    console.log(muns)
    this.map.update();
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
  }
}