(function($) {

	'use strict';

	function Tab(wrapper, options) {
		var defaults = {
			tab: '.tab span',
			content: '.content div',
			isHoverTrigger: true,	// mouseover vs. mouseover jquery里没有hover事件
			isClickeTrigger: false,
			isAutoTrigger: true,
			curClass: 'cur',
			animTime: 0,
			autoInterval: 1000
		};

		this.settings = $.extend(defaults, options);
		this.$wrapper = $(wrapper);

		this.init();

		this.bindHandler();

	}

	Tab.prototype = {
		init: function() {

			this.$tab = this.$wrapper.find(this.settings.tab);
			this.$content = this.$wrapper.find(this.settings.content);
			this.index = 0;
			this.inter = null;

			if(this.settings.isHoverTrigger) {
				this.triggerEvent = 'mouseover';
			} else {
				this.triggerEvent = 'click';
			}

			if(this.settings.isAutoTrigger) {
				this.setAutoTrigger();
			}
			
		},
		setAutoTrigger: function() {
			var _self = this;

			this.inter = setInterval(function() {
				_self.triggerNext();
			}, 1000);
		
		},

		triggerNext: function() {
			this.index ++;
			if(this.index == this.$tab.length) {
				this.index = 0;
			}
			$(this.$tab[this.index]).trigger(this.triggerEvent);			
		},

		bindHandler: function() {
			function showTab(_self) {
				var $this = $(this);
				var index = $this.index();

				$this.addClass(_self.settings.curClass)
					.siblings()
					.removeClass(_self.settings.curClass);

				_self.$content
					.eq(index)
					.show(_self.settings.animTime)
					.siblings()
					.hide(_self.settings.animTime);

				_self.index = index;
			}

			var _self = this;
			/*if(this.settings.isClickeTrigger) {
				this.$tab.click(function() {
					...
				})
			}*/
			this.$tab.click(function() {
				if (_self.triggerEvent === 'click') {
					showTab.call(this, _self);
				}
			});

			this.$tab.mouseover(function() {
				if (_self.triggerEvent === 'mouseover') {
					showTab.call(this, _self);
				}
			});

			this.$tab.hover(function() {
				clearInterval(_self.inter);
			}, function() {
				_self.setAutoTrigger();
			});

			$(this.$tab[_self.index]).trigger(this.triggerEvent);
		}
	}

	window.Tab = Tab;

	$.fn.tab = function(options) {
		var tab = new Tab(this, options);
		return $(this);
	};

})(jQuery);