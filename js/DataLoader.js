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
}