(function() {
	var bootstrapper = (function() {	
		return {
			load: function(options) {
				var dependencies = options.dependencies || [],
					onLoad = options.onLoad || function() {};

				require({
					// Define commonly used libs here. 
					// They can then be referred to by their name, rather than their path.
					paths: {
						jquery: 'lib/jquery.1.7.1.min',			// In jQuery 1.7+, CommonJS AMD is baked in
						underscore: 'lib/require_underscore',	// Wrapper modules for Underscore
						backbone: 'lib/require_backbone',		// ... Backbone
						mustache: 'lib/require_mustache'		// ... and Mustache
					}
				}, dependencies, onLoad);
			}
		}
	}());

	bootstrapper.load(theConfig);
}());