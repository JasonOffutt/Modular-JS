(function() {
	define(['backbone', 'itemfeature'],
		function(Backbone, Namespace) {
			var app = {
				start: function() {
					// Wire up some dummy data so we have something to work with...
					var collection = new Namespace.Collection([
							{ id: 1, name: 'foo' },
							{ id: 2, name: 'bar' },
							{ id: 3, name: 'baz' }
						]),
						router = new Namespace.Router({ items: collection, ev: Namespace.Events });
					Backbone.history.start();
				}
		};
		
		return app;
	});
}());