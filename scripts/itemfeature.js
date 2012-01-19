(function() {
	// NOTE: I chose to implement all of my application constructs in a single module
	// rather than separate ones. Logically it seemed to make more sense to group modules
	// together as a "feature" rather than a logical set of roles within the application
	// (e.g. - Models, Routers, Views, etc). Originally, I had them broken out that way,
	// but the amount of modules I had to deal with quickly became less manageable, and 
	// the overhead of additional HTTP requests didn't seem to buy me that much in terms
	// of flexibility. Your mileage may vary if you've got a set of more generic utility
	// objects and functions that you need to break out and reuse all over the place.
	
	define(['jquery', 'underscore', 'backbone', 'mustache'], function() {
		// Hanging all app/Backbone constructs off a namespace object to return as a module
		var Namespace = {};
		
		// Basic event aggrigator pattern implemetation for pub/sub awesomeness.
		// Great read on this pattern here: http://bit.ly/p3nTe6
		Namespace.Events = _.extend({}, Backbone.Events);
		
		Namespace.Model = Backbone.Model.extend({
			initialize: function(options) {
				_.bindAll(this);	// <3 being able to rely on 'this' actually being 'this'
			}
		});
		
		Namespace.Collection = Backbone.Collection.extend({
			initialize: function(options) {
				this.model = Namespace.Model;
				_.bindAll(this);
			},
			comparator: function(item) {
				return item.get('id');
			}
		});
		
		Namespace.ItemList = Backbone.View.extend({
			tagName: 'ul',
			className: 'items',
			template: '{{#items}}<li><a id="{{id}}" href="#item/{{id}}">{{name}}</a></li>{{/items}}',
			events: {
				'click li a': 'selectItem'
			},
			initialize: function(options) {
				this.model = options.model;
				this.ev = options.ev;
				_.bindAll();	// bindAll becomes extra handy when using Event Aggrigation
			},
			render: function() {
				var $el = $(this.el),
					tmp = { items: this.model.toJSON() },
					html = Mustache.to_html(this.template, tmp);
				$el.html(html);
				$('.wrapper').hide().empty().append($el).fadeIn();
			},
			selectItem: function(e) {
				var id = e.srcElement.id,
					$el = $(this.el),
					that = this;
				this.ev.trigger('itemSelected', id);
				$el.fadeOut(function() {
					that.remove();
				});
				
				return false;
			}
		});
		
		Namespace.Item = Backbone.View.extend({
			tagName: 'div',
			className: 'item',
			template: '<p>ID: {{id}}</p><p><strong>{{name}}</strong></p><a href="#" class="back">Back</a>',
			initialize: function(options) {
				this.model = options.model;
				this.ev = options.ev;
				_.bindAll();
			},
			events: {
				'click .back': 'back'
			},
			render: function() {
				var $el = $(this.el),
					html = Mustache.to_html(this.template, this.model.toJSON());
				$el.html(html).prependTo('body').hide().fadeIn();
			},
			back: function() {
				var $el = $(this.el),
					that = this;
				this.ev.trigger('backClicked');
				$el.fadeOut(function() {
					that.remove();
				});
				
				return false;
			}
		});
		
		Namespace.Router = Backbone.Router.extend({
			routes: {
				'': 'index',
				'item/:id': 'item'
			},
			initialize: function(options) {
				this.items = options.items || new Namespace.Collection();
				this.ev = options.ev;
				
				// Binding all method's context of 'this' to the current object instance
				// before wiring up the two events handlers that follow.
				_.bindAll(this);
				this.ev.bind('itemSelected', this.onItemSelected);
				this.ev.bind('backClicked', this.goBack);
				Backbone.history.loadUrl();
			},
			index: function() {
				var indexView = new Namespace.ItemList({
					model: this.items,
					ev: this.ev
				});
				
				indexView.render();
			},
			item: function(id) {
				var item = this.items.get(id),
					itemView = new Namespace.Item({ 
						model: item, 
						ev: this.ev 
					});
					
				itemView.render();
			},
			onItemSelected: function(id) {
				// Without first calling _.bindAll(), the value of 'this' is not
				// necessarily going to be the current instance of the Router any more.
				// In fact, 'this' will probably be the global object.
				this.navigate('item/' + id, true);
			},
			goBack: function() {
				this.navigate('', true);
			}
		});
		
		return Namespace;
	})
}());