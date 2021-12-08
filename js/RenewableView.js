class RenewableView extends View {
	constructor(data) {
		super();
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