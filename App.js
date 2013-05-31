Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    

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
                    }
                ],
                listeners: {
                    load: function(store){
                        // debugger
                    }
                }
            },

            // storeType: 'Rally.data.lookback.SnapshotStore',
            // storeConfig: {
            //     autoLoad: true,
            //     model: 'User Story',
            //     fetch: ['FormattedID', 'Name', 'InProgressDate', 'AcceptedDate', 'PlanEstimate'],
            //     filters: [
            //         {
            //             property: 'ScheduleState',
            //             operator: '=',
            //             value: 'Accepted'
            //         },
            //         {
            //             property: 'InProgressDate',
            //             operator: '!=',
            //             value: null
            //         }
            //     ],
            // },

            calculatorType: 'CycleTimeCalculator',
            calculatorConfig: {

            },

            chartConfig: {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Height Versus Weight of 507 Individuals by Gender'
                },
                subtitle: {
                    text: 'Source: Heinz  2003'
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: 'Estimated Size'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true
                },
                yAxis: {
                    title: {
                        text: 'Cycle Time'
                    }
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
                            pointFormat: '{point.x} Size, {point.y} Time, <a href="{point.detailUrl}">{point.id}</a> ID'
                        }
                    }
                }
            }
        });
        this.add(myChart);
    }
});
