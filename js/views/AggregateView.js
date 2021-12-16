class AggregateView extends View {
  constructor(data) {
    super()
    //Should combine it into one data set maybe?
    this.mapData = data["mapData"];
    this.climateLabels = data["climateLabels"];
    this.electionData = data["electionData"];
    this.weights = [{name: "CO2 emissions", key: "CO2", weight: 5, invert: true},
      {name: "Renewable energy", key: "energy", weight: 5, invert: false},
      {name: "Climate support", key: "climate_label", weight: 5, invert: false}];
    const labelX = 'climate';
    const labelY = 'election';
    this.averagePoliticalClimateLabel = calculateAveragePoliticalClimateLabel(this.electionData, this.climateLabels);
    this.data = joinData(data["renewData"], data["co2Data"], "municipality");
    this.data = joinData(this.data, this.averagePoliticalClimateLabel, "municipality");
    this.scores = calculateFinalScore(this.data, this.weights);
  }

  init() {
    const caller = this;
    this.scatterPlot = new ScatterPlot("aggrChart", this.data, caller, this.averagePoliticalClimateLabel,
        "CO2_per_inhabitant", "CO2 per inhabitant","energy", "Energy");
    this.map = new GeoMap('map_aggr', this.mapData, this, () => {} , this.onClick);
    this.addWeightsHtml();
  }

  addWeightsHtml() {
    let self = this;
    let html = this.weights.map(w => {
      return `<div>
                  <p>${w.name}</p>
                  <input id="${w.key}-weight-slider" type="range" min="0" max="10" value="${w.weight}">
                  <label id="${w.key}-weight-label" for="${w.key}-weight-slider">${w.weight}</label>
              </div>`;
    }).join("\n");
    $("#weights").html(html);
    $(`#weights input`).each(function() {
      let updateWeight = function() {
        $(`label[for="${this.id}"]`).html(this.value);
        let value = parseInt(this.value);
        let weight = self.weights.find(w => w.key === this.id.split("-")[0]);
        if(value !== weight.weight){
          weight.weight = value;
          self.update();
        }
      };
      this.onchange = updateWeight;
      this.onmousemove = updateWeight;
    })
  }

  isSelected = (munName) => {
    return state.selectedMunicipality === munName
  };

  getMunName = (d) => {
    return d.target?.attributes?.municipality_name?.value || null
  }

  onClick = (d) => {
    state.setNewMunicipality(this.getMunName(d));
    state.update()
  }

  highlightMap() {
    const mun_name = state.selectedMunicipality;
    this.map.colorPath(mun_name);
  }

  highlight = (d) => {
    return state.selectedMunicipality === d.municipality ? 3 : 0
  }

  fill(d) {
    const munName = d.properties.areaName;
    let score = getMun(this.scores, munName);
    if(score && !isNaN(score.score)) {
      let colorScale = d3.scaleLinear().domain([0, 10]);
      return d3.interpolateRdYlGn(colorScale(score.score));
    } else {
      return "grey";
    }

  }

  update() {
    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    }
    this.scores = calculateFinalScore(this.data, this.weights);
    this.map.update();
    this.scatterPlot.update();
    this.highlightMap();
  }
}