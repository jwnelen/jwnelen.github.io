class StackedBarChart {
	constructor(id, data, keyX, keyYs, onclick = () => {}, colorScheme = d3.schemeSet1) {
		this.margin = {top: 30, right: 30, bottom: 70, left: 60};
		this.widthBar = document.getElementById(id).clientWidth - this.margin.left - this.margin.right;
		this.heightBar = document.getElementById(id).clientHeight - this.margin.top - this.margin.bottom;
		this.id = id;
		this.data = data;
		this.keyX = keyX;
		this.keyYs = keyYs;
		this.windowSize = 20;
		this.middlePoint = null;
		this.onclick = onclick;
		this.colorScheme = colorScheme;
		let self = this;
		$(`#${id}-window`).attr("max", data.length);
		$(`#${id}-window`).val(data.length);
		const changeWindow = function () {
			if (this.value !== self.windowSize) {
				self.windowSize = parseInt(this.value);
				self.update(self.data, self.middlePoint);
			}
		}
		$(`#${id}-window`).on('mousemove', changeWindow);
		$(`#${id}-window`).on('change', changeWindow);

		$(`#${id}-window-display`).html(data.length);
		this.draw();
	}

	update(newData, middlePoint = null) {
		this.data = newData;
		this.middlePoint = middlePoint;
		$(`#${this.id}-window-display`).html(this.windowSize);
		$(`#${this.id}-window`).val(this.windowSize);
		this.draw();
	}

	draw() {
		d3.select("#" + this.id + "svg").remove();
		let data = this.data.sort((a, b) => {
			let sumA = this.keyYs.reduce((sum, k) => sum + a[k], 0);
			let sumB = this.keyYs.reduce((sum, k) => sum + b[k], 0);
			return sumB - sumA;
		});
		if (this.middlePoint) {
			let start = Math.max(data.indexOf(this.middlePoint) - Math.round(this.windowSize / 2), 0);
			let end = start + this.windowSize;
			data = data.slice(start, end);
		}

		const svgBarChart = d3.select("#" + this.id)
			.append("svg").attr("id", this.id + "svg")
			.attr("width", this.widthBar + this.margin.left + this.margin.right)
			.attr("height", this.heightBar + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", `translate(${this.margin.left},${this.margin.top})`);

		// X axis
		let x = d3.scaleBand()
			.range([0, this.widthBar])
			.domain(data.map((d) => {
				return d[this.keyX];
			}))
			.padding(0.2);
		svgBarChart.append("g")
			.attr("transform", "translate(0," + this.heightBar + ")")
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.attr("class", "axis")
			.style("font-size", "10px")
			.style("text-anchor", "end");


		const max = Math.max(...this.getTotal(data).filter(d => !isNaN(d)));
		// Add Y axis
		let y = d3.scaleLinear()
			.domain([0, max])
			.range([this.heightBar, 0]);
		svgBarChart.append("g")
			.call(d3.axisLeft(y));

		// color palette = one color per subgroup
		let color = d3.scaleOrdinal()
			.domain(this.keyYs)
			.range(this.colorScheme);

		//stack the data? --> stack per subgroup
		let stackedData = d3.stack()
			.keys(this.keyYs)
			(data);

		// Bars
		svgBarChart.append("g")
			.selectAll("g")
			.data(stackedData)
			.enter().append("g")
			.attr("fill", function (d) {
				return color(d.key);
			})
			.selectAll("rect")
			.data(function (d) {
				return d;
			})
			.enter().append("rect")
			.attr("class", d => {
				return d.data === this.middlePoint ? "selected-stack" : "";
			})
			.attr("x", d => x(d.data[this.keyX]))
			.attr("y", d => y(d[1]))
			.attr("municipality_name", d => d.data[this.keyX])
			.attr("width", x.bandwidth())
			.attr("height", d => Math.max(y(d[0]) - y(d[1]), 0))
			.on("click", this.onclick);
	}

	getTotal(data) {
		return data.map(d => {
			return this.keyYs.reduce((sum, k) => sum + d[k], 0);
		})
	}
}