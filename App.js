Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'chart'
        },
        {
            xtype: 'container',
            itemId: 'controls',
            items: [
                {
                    fieldLabel: 'Starting State',
                    itemId: 'startingStateField',
                    padding: '20px',
                    xtype: 'rallyfieldvaluecombobox',
                    model: 'UserStory',
                    field: 'ScheduleState'
                },
                {
                    fieldLabel: 'Ending State',
                    itemId: 'endingStateField',
                    padding: '20px',
                    xtype: 'rallyfieldvaluecombobox',
                    model: 'UserStory',
                    field: 'ScheduleState',
                    defaultSelectionToFirst: false
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);

        this.down('#startingStateField').on('ready', this._onStartingStateReady, this);
    },

    _onStartingStateReady: function(combobox) {
        combobox.setValue('In-Progress');
    },

    launch: function() {
        this._drawChart();
    },

    _drawChart: function() {
        var myChart = Ext.create('Rally.ui.chart.Chart', {

            _haveDataToRender: function() {
                return true;
            },

            storeType: 'Rally.data.WsapiDataStore',
            storeConfig: {
                autoLoad: true,
                model: 'User Story',
                fetch: ['FormattedID', 'Name', 'InProgressDate', 'AcceptedDate', 'PlanEstimate'],
                filters: [
                    {
                        property: 'ScheduleState',
                        operator: '=',
                        value: 'Accepted'
                    },
                    {
                        property: 'InProgressDate',
                        operator: '!=',
                        value: null
                    },
                    {
                        property: 'DirectChildrenCount',
                        operator: '=',
                        value: '0'
                    }
                ],
                listeners: {
                    load: function(store){
                        // debugger
                    }
                }
            },

            calculatorType: 'CycleTimeCalculator',
            calculatorConfig: {

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
                        text: 'Estimated Size'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                    min: 0
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
                            pointFormat: '<a href="{point.detailUrl}">{point.id}</a><br>Estimate: {point.x}<br>Cycle Time: {point.y}'
                        }
                    }
                }
            }
        });
        this.down('#chart').add(myChart);
    }
});
