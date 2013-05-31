(function() {

	var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     * This class can be used to calculate cycle time
     */
    Ext.define('CycleTimeCalculator', {
        constructor: function(config) {
            Ext.apply(this, config);
        },

        // Takes a store and creates an array of series data
        prepareChartData: function(store) {
            cycleTimes = []
            store.each(function(record) {
            	var cycleTime = this._calculateCycleTime(record);
            	cycleTimes.push({
            		x: record.get('PlanEstimate'), 
            		y: cycleTime,
            		id: record.get('FormattedID'),
            		detailUrl: Rally.nav.Manager.getDetailUrl(record)
            	});
            }, this);

            series = []
            series.push({
            	'name': 'Cycle Times',
            	'color': 'rgba(223, 83, 83, .5)',
            	'data': cycleTimes
            });

            console.log(series);

			return {
	 			"series": series
			}
        },

        // runCalculations: function(snapshot) {
        // 	debugger
        // },

        _calculateCycleTime: function(record){
        	MS_TO_DAYS = 1000 * 60 * 60 * 24; // MS/sec * sec/min * min/hr * hr/day
          	var acceptedDate = new Date(record.get('AcceptedDate'));
    		var inProgressDate = new Date(record.get('InProgressDate'));

    		return Math.round((acceptedDate - inProgressDate) / MS_TO_DAYS);
        }

    });
})();