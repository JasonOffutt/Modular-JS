(function() {
	var Bootstrapper = (function() {	
		return {
			load: function(options) {
				var dependencies = options.dependencies || [],
					onLoad = options.onLoad || function() {};

				require({
					// Define commonly used libs here. 
					// They can then be referred to by their name, rather than their path.
					paths: {
						jquery: 'lib/jquery.1.7.1.min',
						underscore: 'lib/require_underscore',
						backbone: 'lib/require_backbone',
						mustache: 'lib/require_mustache'
					}
				}, dependencies, onLoad);
			}
		}
	}());

	Bootstrapper.load(theConfig);
}());