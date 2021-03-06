class View {
	constructor() {
		this.isInitialized = false;
	}

	htmlIncludesSelection(id, keys, onclick) {
		let keyString = keys.map(k => {
			return `<div>
			    <input type="checkbox" id="include-${k}" name="${k}"
			           checked>
			    <label for="include-${k}">${k}</label>
			</div>`
		}).join("\n");
		$(`#${id}`).html(keyString);
		keys.forEach(k => {
			document.getElementById(`include-${k}`).onchange = onclick;
		})
	}
}