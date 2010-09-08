


/**
 * BarChart is the main class for generating... bar charts (another surprise!).
 */

pvc.BarChart = pvc.CategoricalAbstract.extend({

  barChartPanel : null,

  constructor: function(o){

    this.base();

    var _defaults = {
      showValues: true,
      stackedBarChart: false,
      panelWidthPercentage: 1,
      innerBandWidthPercentage: 1,
      maxBarSize: 2000,
      originIsZero: true
    };


    // Apply options
    $.extend(this.options,_defaults, o);


  },

  preRender: function(){

    this.base();

    pvc.log("Prerendering in barChart");


    this.barChartPanel = new pvc.BarChartPanel(this, {
      stacked: this.options.stackedBarChart,
      panelWidthPercentage: this.options.panelWidthPercentage,
      barWidthPercentage: this.options.barWidthPercentage,
      maxBarSize: this.options.maxBarSize,
      showValues: this.options.showValues
    });

    this.barChartPanel.appendTo(this.basePanel); // Add it

  },

  /*
   * Generic xx scale for testing purposes. Needs to be overriden per chart
   */

  getXScale: function(){

    return new pv.Scale.ordinal(pv.range(0,this.dataEngine.getCategoriesSize()))
    .splitBanded(0, this.basePanel.width, this.options.panelWidthPercentage);

  },

  /*
   * Generic yy scale for testing purposes. Needs to be overriden per chart
   */

  getYScale: function(){

    var max = this.dataEngine.getSeriesAbsoluteMax();
    var min = this.dataEngine.getSeriesAbsoluteMin();
    if(min > 0 && this.options.originIsZero){
      min = 0
    }
    return new pv.Scale.linear(min,max);
  },

  /*
   * Generates the X axis. It's in a separate function to allow overriding this value
   */

  generateXAxis: function(){

    if (this.options.showXScale){
      this.xAxisPanel = new pvc.XAxisPanel(this, {
        ordinal: true,
        showAllTimeseries: false,
        anchor: this.options.xAxisPosition,
        axisSize: this.options.xAxisSize,
        oppositeAxisSize: this.options.yAxisSize,
        fullGrid:  this.options.xAxisFullGrid,
        elements: this.dataEngine.getCategories()
      });

      this.xAxisPanel.setScale(this.xScale);
      this.xAxisPanel.appendTo(this.basePanel); // Add it

    }


  }

}
);


/*
   * Bar chart panel. Generates a bar chart. Specific options are:
   * <i>showValues</i> - Show or hide bar value. Default: false
   * <i>stackedBarChart</i> -  Stacked? Default: false
   * <i>panelWidthPercentage</i> - Percentage of the band occupied by the pane;. Default: 0.5 (50%)
   * <i>barWidthPercentage</i> - In multiple series, percentage of inner
   * band occupied by bars. Default: 0.5 (50%)
   * <i>maxBarSize</i> - Maximum size of a bar in pixels. Default: 2000
   *
   * Has the following protovis extension points:
   *
   * <i>chart_</i> - for the main chart Panel
   * <i>bar_</i> - for the main bar wedge
   * <i>barLabel_</i> - for the main bar label
   */


pvc.BarChartPanel = pvc.BasePanel.extend({

  _parent: null,
  pvBar: null,
  pvBarLabel: null,
  data: null,

  stacked: false,
  panelWidthPercentage: 1,
  barWidthPercentage: 0.5,
  maxBarSize: 2000,
  showValues: true,


  constructor: function(chart, options){

    this.base(chart,options);

  },

  create: function(){

    var myself=this;
    this.width = this._parent.width;
    this.height = this._parent.height;

    this.pvPanel = this._parent.getPvPanel().add(this.type)
    .width(this.width)
    .height(this.height)

    // Extend body

    var y = this.chart.getYScale().range(0,this.height);
    var x = this.chart.getXScale();

    // 1 - single series

    this.pvBar = this.pvPanel.add(pv.Bar)
    .data(this.chart.dataEngine.getValuesForSeriesIdx(0))
    .left(function(d){
      pvc.log("Left position: " + x(this.index));
      return x(this.index)
    })
    .bottom(0)
    .width(x.range().band)
    .height(y)

    // Labels:

    this.pvBar
    .anchor("bottom")
    .add(pv.Label)
    .bottom(0)
    .text(function(d){
      return myself.chart.dataEngine.getCategories()[this.index]
    })
    
    


  //this.extend(this.pvPanel,"chart_");


  }

});