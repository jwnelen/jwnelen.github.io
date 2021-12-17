class PoliticalView extends View {
	constructor(data) {
		super();
		this.electionData = data["electionData"];
		this.co2Data = data["co2Data"];
		this.uniquePartyList = data['uniquePartyList'];
		this.climateLabels = data["climateLabels"];
		this.mapData = data["mapData"];
		this.averagePoliticalClimateLabel = calculateAveragePoliticalClimateLabel(this.electionData,this.climateLabels)
		this.colors = d3.scaleOrdinal().domain(["F","E","D","C","B","A"]).range(["#ff0000","#ff4200","#ffa300","#fafa00","#00d100","#008200"])
	}

	updateHighlights = () => {
		let currentMunicipality = state.selectedMunicipality
		if (currentMunicipality) {
			let currMunPoliticsData = this.averagePoliticalClimateLabel.filter(entry => entry['municipality'] === currentMunicipality)[0]
			this.gauge.set(currMunPoliticsData.climate_label)
			$(".mun-name").html(currentMunicipality);
			$("#preview-textfield").html(Number.parseFloat(currMunPoliticsData.climate_label).toFixed(2))
			this.histogram.update(this.averagePoliticalClimateLabel, currMunPoliticsData.climate_label, currentMunicipality);
			this.map.colorPath(currentMunicipality)
			this.barChart = new BarChart("votes-percentages-chart", currMunPoliticsData.percentages_votes_per_label,
					"label", "percentage", false, this.colors)
			let climateLabelPercentile = percentileOfDataset(this.averagePoliticalClimateLabel, "climate_label", currMunPoliticsData.climate_label)
			$("#label-percentile").html(Number.parseFloat(climateLabelPercentile * 100).toFixed(1) + "%")
		} else {
			$(".mun-name").html(currentMunicipality + " is undefined unfortunately 😔")
			$("#preview-textfield").html("Not available!");
			this.gauge.set(0)
		}
	}

	onMapClicked = (d) => {
		const mun = getMunFromEvent(d)
		state.setNewMunicipality(mun);
		state.update()
	}

	init() {
		// Constructing all elements
		this.histogram = new Histogram("label-hist",this.averagePoliticalClimateLabel,'climate_label',
				null, (e) => this.onMapClicked(e))
		this.map = new GeoMap("map_political", this.mapData,
			this,(e) => this.onMapClicked(e))

		this.target = document.getElementById("demo")
		this.gauge = new Gauge(this.target).setOptions(opts);
		this.gauge.maxValue = 6;
		this.gauge.setMinValue(0);
		this.gauge.set(0);
		this.gauge.animationSpeed = 32
		this.isInitialized = true;
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
			this.updateHighlights()
		} else {
			this.updateHighlights()
		}
	}

	fill(d) {
		let min = getMin(this.averagePoliticalClimateLabel.filter(d => d.climate_label !== -1), "climate_label");
		let max = getMax(this.averagePoliticalClimateLabel, "climate_label");
		let areaName = d.properties.areaName;

		let x = this.averagePoliticalClimateLabel.find(element => element.municipality === areaName);
		if(typeof(x) === "undefined" || x.climate_label === -1){
			return "#D3D3D3";
		}
		else{
			let colorScaleLabelData = d3.scalePow().domain([min, max]).range(["#ff726f","#00703c"]);
			return colorScaleLabelData(x.climate_label);
		}
	}
}