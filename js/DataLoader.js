class DataLoader {
	constructor(files) {
		this.files = files;
	}

	getData(succes) {
		let promises = this.files.map(x => {
			let suffix = x.filename.split(".");
			suffix = suffix[suffix.length-1];
			switch (suffix) {
				case "csv": return d3.csv(x.filename);
				case "json": return d3.json(x.filename);
			}
		});
		Promise.all(promises).then((datasets) => {
			let res = {};
			datasets.forEach((v, i) => {
				res[this.files[i].name] = v;
			});
			this.data = res;
			succes(res);
		});
	}

	changeKeys(data, keys) {
		data.forEach(d => keys.forEach(k => {
			d[k.to] = d[k.from];
			delete d[k.from];
		}))
	}

	getPercentiles(data, attr, num = 10) {
		let range = Array.from({length: num}, (v, i) => i);
		let quantile = d3.scaleQuantile().domain(data.map(x => x[attr]))
			.range(range);
		let thresholds = quantile.quantiles();
		return thresholds;
	}
}