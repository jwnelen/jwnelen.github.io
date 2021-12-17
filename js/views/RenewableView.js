class RenewableView extends View {
	constructor(data) {
		super();
		this.renewable = data["renewData"]
		this.mapData = data["mapData"]
	}

	init() {
		this.map = new GeoMap("map_renew", this.mapData, this, (e) => this.onMunClicked(e))
		this.histogram = new Histogram('histogram_renew', this.renewable, 'energy', null, (e) => this.onMunClicked(e))
	}

	highlightSelected = () => {
		const mun_name = state.selectedMunicipality;
		this.map.update()
		this.map.colorPath(mun_name);
		$(".mun-name").html(mun_name);
		this.histogram.update(this.renewable,null, mun_name)

	}

	onMunClicked = (d) => {
		const mun = getMunFromEvent(d)
		state.setNewMunicipality(mun);
		state.update()
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
			this.highlightSelected()
		} else {
			this.highlightSelected()
		}
	}

	fill(d) {
		const areaName = d.properties.areaName
		const energy = this.renewable.filter(m => m["municipality"] === areaName)[0]?.energy

		const maxEnergy = getMax(this.renewable, 'energy')
		const minEnergy = getMin(this.renewable, 'energy')
		if (energy) {
			let colorScaleCO2Data = d3.scaleLinear().domain([minEnergy, 20])
			return d3.interpolateBlues(colorScaleCO2Data(energy));
		} else {
			return 'grey'
		}
	}
}