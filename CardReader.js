/**
 * jQuery based magnetic stripe card reader "driver" to be used in web
 * applications.
 *
 * Copyright @ 2009-2010 Jonathan Stoppani (http://garetjax.info/)
 * Licensed under the MIT license (see LICENSE for details)
 */

(function(window, $) {
	var CardReader = function(elem, options, callback) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data('cardreader');
		this.callback = callback;

	};

	CardReader.prototype = {

		init: function() {
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			this.config.error_start = this.config.error_start.charCodeAt(0);
			this.config.track_start = this.config.track_start.charCodeAt(0);
			this.config.track_end = this.config.track_end.charCodeAt(0);

			this.started = false;
			this.finished = false;
			this.isError = false;
			this.input = "";
			this.timer = undefined;
			this.isDispatching = false;

			var obj = this;
			this.$elem.keypress(function(e) {
				CardReader.prototype.readObserver.apply(obj, arguments);
			});

			return this;
		},
		defaults: {
			validators: [],
			error_start: "é",
			track_start: "%",
			track_end: "_",
			timeout: 100
		},
		dispatch: function(data, isError) {
			if (!isError) {
				for (var cb in this.config.validators) {
					if (!this.config.validators[cb](data)) {
						isError = true;
						break;
					}
				}
			}

			if (this.isDispatching) {
				if (isError) {
					console.log("Immediate error!");
					return;
				} else {
					clearTimeout(this.isDispatching);
				}
			}

			var reader = this;

			this.isDispatching = setTimeout(function() {
				reader.isDispatching = false;
			}, 200);

			if (isError) {
				console.log("error");

				this.callback(true, this.input);
			} else {
				console.log("success");
				this.callback(false, this.input);
			}
		},



		readObserver: function(e) {
			var ob = this;
			if (!this.started && (e.which === this.config.track_start || e.which === this.config.error_start)) {
				e.stopImmediatePropagation();
				e.preventDefault();

				this.input += String.fromCharCode(e.which);
				this.started = true;
				this.isError = e.which === this.error_start;

				this.timer = setTimeout(function() {
					ob.started = false;
					ob.finished = false;
					ob.isError = false;
					ob.input = "";
				}, this.config.timeout);
			} else if (this.started && e.which === this.config.track_end) {
				e.stopImmediatePropagation();
				e.preventDefault();

				this.input += String.fromCharCode(e.which);

				this.finished = true;
				clearTimeout(this.timer);
				this.config.timer = setTimeout(function() {
					ob.started = false;
					ob.finished = false;
					ob.isError = false;
					ob.input = "";
				}, this.config.timeout);
			} else if (this.started && this.finished && e.which === 13) {
				e.stopImmediatePropagation();
				e.preventDefault();
				this.dispatch(this.input, this.isError);

				this.started = false;
				this.finished = false;
				this.isError = false;
				this.input = "";

				clearTimeout(this.timer);

			} else if (this.started) {
				e.stopImmediatePropagation();
				e.preventDefault();
				this.input += String.fromCharCode(e.which);

				clearTimeout(this.timer);
				this.timer = setTimeout(function() {
					ob.started = false;
					ob.finished = false;
					ob.isError = false;
					ob.input = "";
				}, this.config.timeout);
			}
		},


		validate: function(validator) {
			this.config.validators.push(validator);
		}

	};

	CardReader.defaults = Plugin.prototype.defaults;

	$.fn.cardReader = function(options, callback) {
		return this.each(function() {
			new CardReader(this, options, callback).init();
		});
	};

	window.CardReader = CardReader;

})(window, jQuery);
