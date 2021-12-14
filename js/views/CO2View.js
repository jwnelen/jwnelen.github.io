class CO2View extends View {
	constructor(data) {
		super();
		this.co2PerSector = data["co2PerSector"];
		this.co2Data = data["co2Data"];
		this.mapData = data["mapData"];
		this.inhabitantData = data["inhabitantData"];
		this.co2MapData = data["co2Data"];
	}

	init() {
		this.barChart = new BarChart("barchart", getCO2DivisionSector(this.co2PerSector, "Aa en Hunze"), "sector", "value", false);
		this.stackedBarchart = new StackedBarChart("co2stackedbar", this.co2PerSector,
			"municipality",
			["Transport", "Agriculture", "Built environment", "Industry"],
			this.onMapClick);
		this.map = new GeoMap("map_nl", this.mapData, this, () => {
		}, this.onMapClick);
		this.map.toolTip.setToolTipText((d) => {
			let mun = this.co2Data.find(c => c.municipality === getMunFromEvent(d));
			return `${getMunFromEvent(d)} - CO2: ${mun ? new Intl.NumberFormat().format(mun.CO2) : -1}`;
		});

		const onChecked = () => {
			this.setCO2MapData();
			this.map.update();
		};

		this.htmlIncludesSelection("include-sector",
			Object.keys(this.co2PerSector[0]).filter(k => k !== "Total" && k !== "municipality"),
			onChecked);
		this.setCO2MapData();
		this.map.update();

		this.isInitialized = true;
	}

	update() {
		if (!this.isInitialized) {
			this.init();
			this.isInitialized = true;
		}
	}

	onMapClick = (d) => {
		let mun = getMunFromEvent(d);
		let co2 = getMun(this.co2Data, mun).CO2;
		this.barChart.update(getCO2DivisionSector(this.co2PerSector, mun));
		this.stackedBarchart.update(this.co2PerSector, getMun(this.co2PerSector, mun));
		this.map.colorPath(mun);
		$(".mun-name").html(mun);
		$(".co2-amount").html(`${new Intl.NumberFormat().format(co2)} tons`);
	}

	setCO2MapData() {
		let checked = $("#include-sector input").map(function () {
			return {name: this.name, checked: this.checked};
		}).get();
		this.co2MapData = this.co2Data.filter(d => d.municipality !== "Gemeente onbekend")
			.map(d => {
				let sectorData = this.co2PerSector.find(s => s.municipality === d.municipality);
				let pop = this.inhabitantData.find(h => h.municipality === d.municipality).inhabitants;
				let CO2 = checked.reduce((sum, c) => c.checked ? sum + sectorData[c.name] : sum, 0);
				return {
					municipality: d.municipality,
					CO2: CO2 / pop
				}
			});
	}

	fill(d) {
		let min = getMin(this.co2MapData.filter(d => d.CO2 !== -1), "CO2");
		let max = getMax(this.co2MapData, "CO2");

		let areaName = d.properties.areaName;
		let x = this.co2MapData.find(element => element.municipality === areaName);
		if (typeof (x) === "undefined" || x.CO2 < 0) {
			return "grey";
		} else {
			let colorScaleCO2Data = d3.scaleLinear().domain([min, max]);
			return d3.interpolateBlues(colorScaleCO2Data(x.CO2));
		}
	}
}