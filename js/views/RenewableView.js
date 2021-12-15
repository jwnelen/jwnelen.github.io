class RenewableView extends View {
	constructor(data) {
		super();
		this.renewable = data["renewData"]
		this.mapData = data["mapData"]
	}

	init() {
		this.map = new GeoMap("map_renew", this.mapData, this, () => {
		}, (e) => this.onMunClicked(e))
		const munSelected = this.renewable.filter(m => m["municipality"] === state.selectedMunicipality)[0]
		if (munSelected) {
			const labels = Object.entries(munSelected).filter(([key, val], index) => key !== 'municipality')
			const d = labels.map(([lab, va], index) => ({"label": lab, "value": va}))
			this.barChart = new BarChart('barchartrenew', d, "label", "value", false)
		}
	}

	highlightSelected = () => {
		const mun_name = state.selectedMunicipality;
		this.map.update()
		this.map.colorPath(mun_name);
		$(".mun-name").html(mun_name);
		const munSelected = this.renewable.filter(m => m["municipality"] === mun_name)[0]

		if (munSelected) {
			const labels = Object.entries(munSelected).filter(([key, val], index) => key !== 'municipality')
			const d = labels.map(([lab, va], index) => ({"label": lab, "value": va}))
			this.barChart.update(d)
		}
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
		return "grey"
	}
}