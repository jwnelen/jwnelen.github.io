class Legend {
	constructor(id, colorScheme) {
		this.id = id;
		this.colorScheme = colorScheme;
		this.init();
	}

	init() {
		let html = Object.keys(this.colorScheme).map(k => {
			return `<div class="legend-item">
                                <div class="legend-dot" style="background-color: ${this.colorScheme[k]}"></div>
                                <div class="legend-text">${k}</div>
                            </div>`
		}).join("\n");
		$(`#${this.id}`).html(html);
	}
}