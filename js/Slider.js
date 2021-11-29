class Slider {
  constructor(min, max, onChange) {
    this.width = 400;
    this.height = 150;

    let sliderSimple = d3
        .sliderBottom()
        .min(min)
        .max(max)
        .width(this.width)
        .tickFormat(d3.format(",.2r"))
        .ticks(6)
        .default((min + max) / 2)
        .on('onchange', val => {
          onChange(val)
        });

    let gSimple = d3
        .select('div#slider')
        .append('svg')
        .attr('width', this.width + 100)
        .attr('height', this.height)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gSimple.call(sliderSimple);

    d3.select('p#value-simple').text(d3.format(",.2r")(sliderSimple.value())); // display value
  }
}
