class PoliticalView extends View {
	constructor(data) {
		super();
		this.electionData = data["electionData"];
		this.co2Data = data["co2Data"];
		this.uniquePartyList = data['uniquePartyList'];
		this.climateLabels = data["climateLabels"];
		this.mapData = data["mapData"];
		this.averagePoliticalClimateLabel = calculateAveragePoliticalClimateLabel(this.electionData,this.climateLabels)

	}

	init() {
		// Constructing all elements
		const map = new GeoMap("map_political", this.mapData,  this, (mun) => {
			let currentMunicipality = this.averagePoliticalClimateLabel.filter(entry => entry['municipality'] == mun )[0]
			if (!(typeof currentMunicipality === "undefined")){
				let currMunicipPoliticsData = this.averagePoliticalClimateLabel.filter(entry => entry['municipality'] == mun )[0]
				var colors = d3.scaleOrdinal().domain(["F","E","D","C","B","A"]).range(["#ff0000","#ff4200","#ffa300","#fafa00","#00d100","#008200"])
				this.barChart = new BarChart("votes-percentages-chart",currMunicipPoliticsData.percentages_votes_per_label,"label","percentage",false,colors)
				gauge.set(currMunicipPoliticsData.climate_label)
				$(".mun-name").html(mun);
				$("#preview-textfield").html(Number.parseFloat(currMunicipPoliticsData.climate_label).toFixed(2))
				this.histogram.update(this.averagePoliticalClimateLabel,currMunicipPoliticsData.climate_label);

				var climateLabelPercentile = percentileOfDataset(this.averagePoliticalClimateLabel,"climate_label",currMunicipPoliticsData.climate_label)
				$("#label-percentile").html(Number.parseFloat(climateLabelPercentile*100).toFixed(1)+"%")
			}
			else{
				$(".mun-name").html(mun+" is undefined unfortunately 😔")
				$("#preview-textfield").html("Not available!");
				gauge.set(0)
			}
		});

		var target = document.getElementById("demo")
		var gauge = new Gauge(target).setOptions(opts);
		gauge.maxValue = 6;
		gauge.setMinValue(0);
		gauge.set(0);
		gauge.animationSpeed = 32


		this.histogram = new Histogram("label-hist",this.averagePoliticalClimateLabel,'climate_label')
		this.isInitialized = true;
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
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