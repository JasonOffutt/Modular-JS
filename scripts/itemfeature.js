(function() {
	define(['jquery', 'underscore', 'backbone', 'mustache'], function() {
		var Namespace = {};
		Namespace.Events = _.extend({}, Backbone.Events);
		
		Namespace.Model = Backbone.Model.extend({
			initialize: function(options) {
				_.bindAll(this);
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
				_.bindAll();
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
				_.bindAll(this);
				this.ev.bind('itemSelected', this.onItemSelected);
				this.ev.bind('backClicked', this.goBack);
				Backbone.history.loadUrl();
			},
			index: function() {
				this.indexView = new Namespace.ItemList({
					model: this.items,
					ev: this.ev
				});
				this.indexView.render();
			},
			item: function(id) {
				var item = this.items.get(id);
				this.itemView = new Namespace.Item({ model: item, ev: this.ev });
				this.itemView.render();
			},
			onItemSelected: function(id) {
				this.navigate('item/' + id, true);
			},
			goBack: function() {
				this.navigate('', true);
			}
		});
		
		return Namespace;
	})
}());