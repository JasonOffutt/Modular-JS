(function() {
	define(['underscore', 'backbone'], function(_, Backbone) {
		var events = _.extend({}, Backbone.Events);		
		return events;
	});
}());