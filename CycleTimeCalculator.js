(function() {

	var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     * This class can be used to calculate cycle time
     */
    Ext.define('CycleTimeCalculator', {
    	extend: 'Rally.data.lookback.calculator.BaseCalculator',

        constructor: function(config) {
            Ext.apply(this, config);
        },

        // Takes a store and creates an array of series data
        prepareChartData: function(store) {
            var cycleTimes = [];
            var series = [];

            store.each(function(record) {
            	var cycleTime = this._calculateCycleTime(record);
            	cycleTimes.push({
            		x: record.get('PlanEstimate'), 
            		y: cycleTime,
            		id: record.get('FormattedID'),
            		detailUrl: Rally.nav.Manager.getDetailUrl(record),
            		childCount: record.get('DirectChildrenCount')
            	});
            }, this);

            series.push({
            	'name': 'Stories',
            	'fillColor': 'rgba(58, 5, 161, 0.6)',
            	'lineColor': 'rgba(58, 5, 161, 0.6)',
            	'data': cycleTimes,
            });

			return {
	 			"series": series
			}
        },

        _calculateCycleTime: function(record){
        	MS_TO_DAYS = 1000 * 60 * 60 * 24; // MS/sec * sec/min * min/hr * hr/day
          	var acceptedDate = new Date(record.get('AcceptedDate'));
    		var inProgressDate = new Date(record.get('InProgressDate'));

    		return (acceptedDate - inProgressDate) / MS_TO_DAYS;
        }

    });
})();