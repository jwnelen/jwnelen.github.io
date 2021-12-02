function changeKeys(data, keys) {
	data.forEach(d => keys.forEach(k => {
		d[k.to] = d[k.from];
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

function parseText(data, keys) {
	data.forEach(d => keys.forEach(k => {
		d[k]
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

function getAverage(data, attr) {
	return data.reduce((sum, d) => sum + d[attr], 0)/data.length;
}

function getMax(data, attr) {
	return data.reduce((max, x) => x[attr] > max? x[attr] : max, 0);
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