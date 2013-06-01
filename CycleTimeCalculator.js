(function() {

	var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     * This class can be used to calculate cycle time
     */
    Ext.define('CycleTimeCalculator', {
    	extend: 'Rally.data.lookback.calculator.TimeInStateCalculator',

    	runCalculation: function (snapshots) {
     		var data = [];

            this.startDate = this._getStartDate(snapshots);
            this.endDate = this._getEndDate(snapshots);

            sortedSnapshots = _.sortBy(snapshots, function(s) {
    			return s.ObjectID;
    		});

    		groupedSnapshots = _.groupBy(sortedSnapshots, function(s) {
    			return s.ObjectID;
    		});

    		_.forEach(groupedSnapshots, function(oidSnapshots) {
    			var estimate = 0;
    			var cycleTime = 0;
    			var id = '';
    			var oid;

    			_.forEach(oidSnapshots, function(snapshot) {
    				if( snapshot._ValidTo !== "9999-01-01T00:00:00.000Z" ){
	    				cycleTime += this._calculateCycleTime(snapshot._ValidTo, snapshot._ValidFrom);
    				}
    				estimate = snapshot.PlanEstimate;
    				id = 'US'+snapshot._UnformattedID;
    				oid = snapshot.ObjectID;
    			}, this);

    			data.push({
    				x: estimate,
    				y: cycleTime,
    				id: id,
    				detailUrl: 'https://rally1.rallydev.com/#/2240613415/detail/userstory/'+oid
    			});
    		}, this);

            return {
    			series: [
    			{
    				name: 'Stories',
    				data:  data
    			}
    			]
    		};
        },

        _calculateCycleTime: function(to, from) {
        	MS_TO_DAYS = 1000 * 60 * 60 * 24; // MS/sec * sec/min * min/hr * hr/day
    		return (new Date(to) - new Date(from)) / MS_TO_DAYS;
        }
    });
})();