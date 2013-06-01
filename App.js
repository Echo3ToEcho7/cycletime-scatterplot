Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'chart',
            height: '400px',
        },
        {
            xtype: 'container',
            itemId: 'controls',
            items: [
                {
                    fieldLabel: 'Starting State',
                    itemId: 'startingStateField',
                    padding: '5px 0 5px 20px',
                    xtype: 'rallyfieldvaluecombobox',
                    model: 'UserStory',
                    field: 'ScheduleState'
                },
                {
                    fieldLabel: 'Ending State',
                    itemId: 'endingStateField',
                    padding: '5px 0 5px 20px',
                    xtype: 'rallyfieldvaluecombobox',
                    model: 'UserStory',
                    field: 'ScheduleState',
                    defaultSelectionToFirst: false
                },
                {
                    fieldLabel: 'Story Size',
                    itemId: 'storySizeField',
                    padding: '5px 0 5px 20px',
                    xtype: 'multislider',
                    width: 255,
                    values: [0, 100],
                    minValue: 0,
                    maxValue: 100
                },
                {
                    text: 'Update',
                    itemId: 'updateButton',
                    margin: '5px 0 5px 20px',
                    xtype: 'button',
                    // width: 255
                }
            ]
        }
    ],

    initComponent: function() {
        // debugger
        this.callParent(arguments);

        this.drawChartWithStartAndEnd = _.after(2, this.drawChartWithStartAndEnd);

        this.down('#startingStateField').on('ready', this._onStartingStateReady, this);
        this.down('#startingStateField').on('ready', this.drawChartWithStartAndEnd, this);

        this.down('#endingStateField').on('ready', this.drawChartWithStartAndEnd, this);

        this.down('#updateButton').on('click', this.drawChartWithStartAndEnd, this);
    },

    _onStartingStateReady: function(combobox) {
        combobox.setValue('In-Progress');
    },

    drawChartWithStartAndEnd: function() {
        // get args
        this._drawChart(this.down('#startingStateField').getValue(), this.down('#endingStateField').getValue());
    },

    _isSingleStorySize: function() {
        storySizeFieldValues = this.down('#storySizeField').getValues();
        return (storySizeFieldValues[0] === storySizeFieldValues[1]);
    },

    _drawChart: function(fromState, toState) {
        var storySizeFieldValues = this.down('#storySizeField').getValues();
        var startEstimate = storySizeFieldValues[0];
        var stopEstimate = storySizeFieldValues[1];

        this.down('#chart').setLoading();

        this._cycleChart = Ext.create('Rally.ui.chart.Chart', {
            itemId: 'cyclechart',

            _haveDataToRender: function() {
                return true;
            },

            storeConfig: {
                find: {
                    '_TypeHierarchy': 'HierarchicalRequirement',
                    '_ProjectHierarchy': this.getContext().get('project').ObjectID,
                    'ScheduleState': { $gte: fromState, $lt: toState},
                    'PlanEstimate': {$gte: startEstimate, $lte: stopEstimate},
                    'Children': null
                },
                fetch: ['ScheduleState', 'PlanEstimate', '_UnformattedID'],
                fields: ['ScheduleState', 'PlanEstimate', '_UnformattedID'],
                hydrate: ['ScheduleState'],

                listeners: {
                    load: function() {
                        if (this.down('#cyclechart')) {
                            this.down('#cyclechart').destroy();
                        }
                        this.down('#chart').add(this._cycleChart);
                        this.down('#chart').setLoading(false);
                    },
                    scope: this
                },
            },

            calculatorType: 'CycleTimeCalculator',
            calculatorConfig: {
                singleStorySize: this._isSingleStorySize(),
                tz: this.getContext().get('workspace').WorkspaceConfiguration.TimeZone,
                trackLastValueForTheseFields: ['_ValidTo', '_ValidFrom', 'PlanEstimate', 'ScheduleState', 'FormattedID']
            },

            chartConfig: {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Story Size Versus Cycle Time'
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: this._isSingleStorySize() ? '' : 'Estimated Size'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                    min: this.down('#storySizeField').getValues()[0],
                    labels: {
                        enabled: !this._isSingleStorySize()
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cycle Time'
                    },
                    min: 0
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    y: 70,
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '<a target="_blank" href="{point.detailUrl}">{point.id}</a><br>Estimate: {point.x}<br>Cycle Time: {point.y}<br>End Date: {point.lastDate}'
                        }
                    },
                    series: {
                        turboThreshold: 10000        
                    }
                }
                
            }
        });

        this.down('#chart').add();
    }
});