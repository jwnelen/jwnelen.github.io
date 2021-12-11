class PoliticalView extends View {
	constructor(data) {
		super();
		this.electionData = data["electionData"];
		this.co2Data = data["co2Data"];
		this.uniquePartyList = data['uniquePartyList']
	}

	init() {
		let co2Party = calculateCO2PerPoliticalParty(this.uniquePartyList, this.electionData, this.co2Data);
		// Constructing all elements
		const partyCO2Chart = new BarChart("partyCO2Chart",co2Party,"party_name","CO2");
		this.isInitialized = true;
	}

	update() {
		if(!this.isInitialized) {
			this.init();
		}
	}
}