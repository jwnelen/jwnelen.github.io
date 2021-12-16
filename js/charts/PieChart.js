class PieChart {
	constructor(id, data, keyX, keyY, fill, filter0 = true) {
		this.margin = {top: 15, right: 15, bottom: 15, left: 15};
		this.width = document.getElementById(id).clientWidth - this.margin.left - this.margin.right;
		this.height = document.getElementById(id).clientHeight - this.margin.top - this.margin.bottom;
		this.radius = Math.min(this.width, this.height) / 2;
		this.id = id;
		this.data = data;
		this.keyX = keyX;
		this.keyY = keyY;
		this.filter0 = filter0;
		this.fill = fill;
		this.draw();
	}

	update(newData) {
		this.data = newData;
		this.draw()
	}

	draw() {
		d3.select("#"+this.id+"svg").remove();
		let data = this.data.sort((a, b) => a[this.keyY]-b[this.keyY]);
		if(this.filter0) {
			data = this.data.filter(d => d[this.keyY] > 0);
		}
		let total = data.reduce((sum, i) => i[this.keyY] + sum, 0);


		let containerWidth = this.width + this.margin.left + this.margin.right;
		let containerHeight = this.height + this.margin.top + this.margin.bottom;

		const svg = d3.select("#"+this.id)
			.append("svg").attr("id", this.id+"svg")
			.attr("width", containerWidth)
			.attr("height", containerHeight)
			.append("g")
			.attr("transform", "translate(" + containerWidth/ 2 + "," + containerHeight / 2 + ")");

		let pie = d3.pie()
			.value((d) => d[this.keyY]);
		let data_ready = pie(data);

		let arcGenerator = d3.arc()
			.innerRadius(0)
			.outerRadius(this.radius);

		svg.selectAll('slices')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arcGenerator)
			.attr('fill', this.fill)
			.attr("stroke", "black")
			.style("stroke-width", "1px");

		svg.selectAll('slices')
			.data(data_ready)
			.enter()
			.append('text')
			.text((d) => {
				let perc = Math.round(d.data[this.keyY]/total*100);
				return perc>0? perc + "%": "";
			})
			.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
			.style("text-anchor", "middle")
			.style("font-size", 12);

	}
}