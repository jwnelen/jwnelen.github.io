class RenewableView extends View {
	constructor(data) {
		super();
		this.renewable = data["renewData"]
		this.mapData = data["mapData"]
	}

	init() {
		this.map = new GeoMap("map_renew", this.mapData, this, () => {}, () => {})
		const munSelected = this.renewable.filter( m => m["municipality"] === state.selectedMunicipality)[0]
		console.log(munSelected)
		// if(munSelected) {
		// 	delete munSelected["municipality"]
		// 	const d = Object.entries(munSelected).map( ([lab, va], index) => ({"label": lab, "value": va}))
		// 	console.log(d)
		// 	this.barChart = new BarChart('barchartrenew', d, "label", "value")
		// }
	}

	highlightSelected = () => {
		const mun_name = state.selectedMunicipality;
		this.map.update()
		this.map.colorPath(mun_name);

		// const munSelected = this.renewable.filter( m => m["municipality"] === state.selectedMunicipality)[0]

		// console.log(munSelected)
		// if(munSelected) {
		// 	delete munSelected["municipality"]
		// 	const d = Object.entries(munSelected).map( ([lab, va], index) => ({"label": lab, "value": va}))
		// 	this.barChart.update(d)
		// }
	}

	onMunClicked = (d) => {
		const mun = getMunFromEvent(d)
		state.setNewMunicipality(mun);
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
		} else {
			this.highlightSelected()
		}
	}

	fill(d) {
		return "grey"
	}
}