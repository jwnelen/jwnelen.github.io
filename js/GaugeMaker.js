var opts = {

    // color configs
    // colorStart: "#6fadcf",
    // colorStop: void 0,
    // gradientType: 0,
    // strokeColor: "#e0e0e0",
    // generateGradient: true,
    // percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],

    // customize pointer
    pointer: {
      length: 0.8,
      strokeWidth: 0.035,
      iconScale: 1.0
    },

    // static labels
    staticLabelsWithText: {
      font: "10px sans-serif",
      labels: [{value:0, label:"F"},
      {value:1, label:"E"},
      {value:2, label:"D"},
      {value:3, label:"C"},
      {value:4, label:"B"},
      {value:5, label:"A"},
      ],
      fractionDigits: 2
    },

    // static zones
    staticZones: [
      {strokeStyle: "#ff0000", min: 0, max: 1},
      {strokeStyle: "#ff4200", min: 1, max: 2},
      {strokeStyle: "#ffa300", min: 2, max: 3},
      {strokeStyle: "#fafa00", min: 3, max: 4},
      {strokeStyle: "#00d100", min: 4, max: 5},
      {strokeStyle: "#008200", min: 5, max: 6},
    ],

    // render ticks
    // renderTicks: {
    //   divisions: 5,
    //   divWidth: 1.1,
    //   divLength: 0.7,
    //   divColor: "#333333",
    //   subDivisions: 3,
    //   subLength: 0.5,
    //   subWidth: 0.6,
    //   subColor: "#666666"
    // },

    // the span of the gauge arc
    angle: -0.15,

    // line thickness
    lineWidth: 0.44,

    // radius scale
    radiusScale: 1.0,

    // font size
    fontSize: 40,

    // if false, max value increases automatically if value > maxValue
    limitMax: false,

    // if true, the min value of the gauge will be fixed
    limitMin: false,

    // High resolution support
    highDpiSupport: true
};