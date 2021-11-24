class DataLoader {
	constructor(files) {
		this.files = files;
	}

	loadCsv(filename) {
		return $.get(filename).then((data) => {
			let commas = data.split("\n")[0].split(",").length;
			let semicolons = data.split("\n")[0].split(";").length;
			let separator = commas > semicolons ? "," : ";";
			let module = $.csv;
			let objects = $.csv.toObjects(data, {separator: separator});
			return objects;
		});
	}

	getData(succes) {
		let promises = this.files.map(x => {
			let suffix = x.filename.split(".");
			suffix = suffix[suffix.length - 1];
			switch (suffix) {
				case "csv":
					return this.loadCsv(x.filename);
				case "json":
					return d3.json(x.filename);
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
		}));
		return data;
	}

	parseNumbers(data, keys) {
		data.forEach(d => keys.forEach(k => {
			d[k] = parseFloat(d[k].replace(",", "."));
		}));
		return data;
	}

	getPercentiles(data, attr, num = 10) {
		let range = Array.from({length: num}, (v, i) => i);
		let quantile = d3.scaleQuantile().domain(data.map(x => x[attr]))
			.range(range);
		let thresholds = [0].concat(quantile.quantiles(), [this.getMax(data, attr) + 1]);
		return thresholds;
	}

	getAverage(data, attr) {
		return data.reduce((sum, d) => sum + d[attr], 0)/data.length;
	}

	getMax(data, attr) {
		return data.reduce((max, x) => x[attr] > max? x[attr] : max, 0);
	}

	joinData(d1, d2, key, sameData = false) {
		if(sameData) {
			return d1.map((v, i) => Object.assign({}, v, d2[i]))
		} else {
			return d1.map(v1 => {
				let vi = d2.find(v2 => {
					return v1[key] === v2[key]
				});
				if(vi !== undefined) {
					return Object.assign({}, v1, vi);
				} else {
					return v1;
				}
			});
		}
	}
}