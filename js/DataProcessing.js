function changeKeys(data, keys) {
	data.forEach(d => keys.forEach(k => {
		if(k.to !== "") {
			d[k.to] = d[k.from];
		}
		delete d[k.from];
	}));
	return data;
}

function parseNumbers(data, keys) {
	data.forEach(d => keys.forEach(k => {
		d[k] = parseFloat(d[k].replace(",", "."));
	}));
	return data;
}

function getPercentiles(data, attr, num = 10) {
	let range = Array.from({length: num}, (v, i) => i);
	let quantile = d3.scaleQuantile().domain(data.map(x => x[attr]))
		.range(range);
	let thresholds = [0, ...quantile.quantiles(), this.getMax(data, attr) + 1];
	return thresholds;
}

function addPercentileClass(data, attr, num=10) {
	let percentiles = getPercentiles(data, attr, num);
	data.forEach(d => {
		d[attr+"Class"] = -1;
		for (let i = 0; i < percentiles.length - 1; i++) {
			if(d[attr] >= percentiles[i]&& d[attr] < percentiles[i+1]) {
				d[attr+"Class"] = i;
			}
		}
	});
}

function getAverage(data, attr) {
	return data.reduce((sum, d) => sum + d[attr], 0)/data.length;
}

function getMax(data, attr) {
	return data.reduce((max, x) => x[attr] > max? x[attr] : max, 0);
}

function getMin(data, attr) {
	return data.reduce((min, x) => x[attr] < min? x[attr] : min, Infinity)
}

function joinData(d1, d2, key, sameData = false) {
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

function changeNames(data, key, names) {
	data.forEach(d => {
		names.forEach(n => {
			let isFrom = d[key].match(n.from);
			d[key] = isFrom? n.to : d[key];
		});
	})
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}