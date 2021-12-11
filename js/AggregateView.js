class AggregateView {
	constructor(data) {

	}

	init() {
		this.isInitialized = true;
	}

	update() {
		if(!this.isInitialized) {
			this.init();
		}
	}
}