class CO2View extends View {
	constructor(data) {
		super();
		this.co2PerSector = data["co2PerSector"];
		this.co2Data = data["co2Data"];
		this.mapData = data["mapData"];
		this.incomes = data["income"];
	}

	init() {
		const incomeValues = this.incomes.map(municipality => parseInt(municipality.income)).filter(x => x)
		const min = Math.min(...incomeValues);
		const max = Math.max(...incomeValues);
		let middleValue = (min + max) / 2;
		this.barChart = new BarChart("barchart", getCO2DivisionSector(this.co2PerSector, "Aa en Hunze"), "sector", "value");

		const map = new GeoMap("map_nl", this.mapData,  this, (mun) => {
			this.barChart.update(getCO2DivisionSector(this.co2PerSector, mun));
		});
		this.isInitialized = true;
	}

	update() {
		if(!this.isInitialized) {
			this.init();
		}
	}

	fill(d) {
		let min = getMin(this.co2Data.filter(d => d.CO2 !== -1), "CO2");
		let max = getMax(this.co2Data, "CO2");
		let areaName = d.properties.areaName;
		let x = this.co2Data.find(element => element.municipality === areaName);
		if(typeof(x) === "undefined" || x.CO2 === -1){
			return "grey";
		}
		else{
			let colorScaleCO2Data = d3.scaleLinear().domain([min, max]).range(["#e5f5f9","#2ca25f"]);
			return colorScaleCO2Data(x.CO2);
		}
	}

}