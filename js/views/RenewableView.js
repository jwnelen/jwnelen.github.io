class RenewableView extends View {
	constructor(data) {
		super();
	}

	init() {
	}

	update() {
		if(!this.isInitialized) {
			this.init();
			this.isInitialized = true;
		}
	}
}