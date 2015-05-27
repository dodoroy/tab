(function($) {

	'use strict';

	function Tab(wrapper, options) {
		var defaults = {
			tab: '.tab span',
			content: '.content div',
			isHoverTrigger: true,	// mouseenter vs. mouseover jquery里没有hover事件
			isClickTrigger: false,
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
			this.curIndex = 0;
			this.inter = null;

			$(this.$tab[this.curIndex]).trigger('click');

			this.setAutoTrigger();

		},

		setAutoTrigger: function() {
			var _self = this;

			if(this.settings.isAutoTrigger) {
				clearInterval(this.inter);
				this.inter = setInterval(function() {
					_self.triggerNext();
				}, 1000);
			}	
					
		},

		triggerNext: function() {
			this.curIndex++;
			if(this.curIndex == this.$tab.length) {
				this.curIndex = 0;
			}
			$(this.$tab[this.curIndex]).trigger('click');			
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

				_self.curIndex = index;
			}

			var _self = this;
			
			this.$tab.click(function() {
				showTab.call(this, _self);
			});

			/*if(this.settings.isHoverTrigger) {
				this.$tab.mouseenter(function() {
					...
				})
			}*///注意if的位置
			this.$tab.mouseenter(function() {	
				if (_self.settings.isHoverTrigger) {
					showTab.call(this, _self);
				}
				clearInterval(_self.inter);	
			});

			this.$tab.mouseleave(function() {
				_self.setAutoTrigger();
			});


			this.$content.mouseenter(function() { 
				clearInterval(_self.inter);	
			});

			this.$content.mouseleave(function() {
				_self.setAutoTrigger();			
			});

		}
	}

	window.Tab = Tab;

	$.fn.tab = function(options) {
		var tab = new Tab(this, options);
		return $(this);
	};

})(jQuery);