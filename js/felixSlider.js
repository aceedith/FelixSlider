(function ($, undefined){
	var PROP_NAME = 'FelixSlider';
	var director = 'Felix Sungchul Kang';
	var version = '1.0';
	var base = 'jquery-1.7.2';

	function FelixSlider(){
		this.debug = false;
		this.director = director;
		this.version = version;
		this._curInst = null;
		this._cursor = 1;
		this._interval = 0;
		this._method = {
			destroy: true
		};
		this._defaults = {
			direction: 'H', // image listing direction V : Vertical, H : Horizental
			showImageCount: 5, // image view count
			padding: 2, // padding
			preClick: null, // function (state) {} : state is success or failure of moving
			nextClick: null, // function (state) {} : state is success or failure of moving
			imageClick: null, // function (target) {} : target is clicked image
			preHtml: null, // preButton design html
			nextHtml: null, // nextButton design html
			intervalType: 'show' // 'show' is to move imagesBox, 'image' is to move one image.
		};
	}

	$.extend(FelixSlider.prototype, {
		log: function (message){
			if(this.debug){
				var date = new Date();
				var liLog = $('<li />', {
					text: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + message,
					css: {
						listStyleType: 'none',
						fontSize: '12px',
						fontFamily: 'Arial',
						borderBottom: '1px dotted gray'
					}
				});
				$('ul', '#sliderLogDiv').append(liLog);
				$('#sliderLogDiv').scrollTop($('#sliderLogDiv').scrollTop() + 100);
			}
		},
		_getInst: function (target){
			try{
				return $.data(target, PROP_NAME);
			}
			catch(err){
				throw 'Missing instance data for this ' + PROP_NAME;
			}
		},
		_attachFelixSlider: function (target, settingsArgs){
			$.felixSlider.log(this.debug);

			if(this.debug){
				var logDiv = $('<div />', {
					id: 'sliderLogDiv',
					css: {
						position: 'absolute',
						width: '300px',
						height: '400px',
						top: '100px',
						left: '200px',
						backgroundColor: '#FFF',
						border: '1px solid gray',
						overflow: 'auto',
						padding: 0,
						margin: 0
					}
				});
				var ulLog = $('<ul />', {
					css: {
						padding: 0,
						margin: 0
					}
				});
				logDiv.append(ulLog);
				$('body').append(logDiv);
				this.log('Start Log');
			}
			
			var settings = $.extend({}, this._defaults, settingsArgs);
			var inst = {};
			inst.settings = $.extend({}, this._defaults, settingsArgs);

			var slider = this._wrapping(target, inst.settings);
			$.data(slider, PROP_NAME, inst);

			this._cssSettings(slider, inst.settings);
			this._eventsSettings(slider, inst.settings);

			this._curInst = inst;
		},
		_eventsSettings: function (target, settings){
			var preButton = $(target).find('.felix-pre-button');
			var nextButton = $(target).find('.felix-next-button');
			var imageButton = $(target).find('img');
			var self = this;

			preButton.click(function (){
				self._preClick(target, settings);
			});
			nextButton.click(function (){
				self._nextClick(target, settings);
			});
			imageButton.click(function (){
				self._imageClick(this, settings);
			});
		},
		_preClick: function (target, settings){
			var state = false;
			if(this._cursor > 1){

				var ul = $(target).find('.felix-ul');
				var moveTo = '+=' + this._interval;

				this.log('pre go');
				this.log('cursor: ' + this._cursor);
				this.log('interval: ' + this._interval);

				if(settings.direction == 'H'){
					ul.animate({
						left: moveTo
					}, 'slow');
				}
				else if(settings.direction == 'V'){
					ul.animate({
						top: moveTo
					}, 'slow');
				}
				
				this._cursor--;
				state = true;
			}
			if(settings.preClick){
				settings.preClick(state);
			}
		},
		_nextClick: function (target, settings){
			var state = false;
			var imageCount = $(target).find('img').length;
			var maxCursor = (settings.intervalType == 'show') ? Math.round(imageCount / settings.showImageCount) : imageCount;

			if(this._cursor < maxCursor){
				
				var ul = $(target).find('.felix-ul');
				var moveTo = '-=' + this._interval;

				this.log('next go');
				this.log('cursor: ' + this._cursor);
				this.log('interval: ' + this._interval);

				if(settings.direction == 'H'){
					ul.animate({
						left: moveTo
					}, 'slow');
				}
				else if(settings.direction == 'V'){
					ul.animate({
						top: moveTo
					}, 'slow');
				}
				
				this._cursor++;
				state = true;
			}
			if(settings.nextClick){
				settings.nextClick(state);
			}
		},
		_imageClick: function (target, settings){
			if(settings.imageClick){
				settings.imageClick(target);
			}
		},
		_cssSettings: function (target, settings){
			var imagesBox = $(target).find('.felix-images-box');
			var ul = $(target).find('ul');
			var li = $(target).find('li');
			var preButton = $(target).find('.felix-pre-button');
			var nextButton = $(target).find('.felix-next-button');
			var image = li.find('img').eq(0);
			var imagesBoxWidth = 0;
			var imagesBoxHeight = 0;
			var targetWidth = 0;
			var targetHeight = 0;
			var imagesWidth = 0;
			var imagesHeight = 0;
			var imageWidth = 0;
			var imageHeight = 0;

			if(settings.direction == 'H'){
				li.addClass('felix-float');
				imagesBoxWidth = (image.width() * settings.showImageCount) + (settings.showImageCount * settings.padding) * 2;
				imagesBoxHeight = image.height();
				imagesWidth = (image.width() * li.length) + (li.length * settings.padding) * 2;
				imagesHeight = imagesBoxHeight;
				imageWidth = image.width();
				imageHeight = image.height();
				if(!settings.preHtml){
					preButton.html('pre');
					preButton.css({
						width: '20px',
						height: imagesBoxHeight,
						fontSize: '15px',
						textAlign: 'center',
						color: 'black'
					});
				}
				if(!settings.nextHtml){
					nextButton.html('next');
					nextButton.css({
						width: '20px',
						height: imagesBoxHeight,
						fontSize: '15px',
						textAlign: 'center',
						color: 'black'
					});
				}
				li.css({
					width: imageWidth,
					height: imageHeight,
					paddingTop: 0,
					paddingRight: settings.padding,
					paddingBottom: 0,
					paddingLeft: settings.padding
				});
				targetWidth = imagesBoxWidth + preButton.width() + nextButton.width();
				targetHeight = imagesBoxHeight;
				if(settings.intervalType == 'show'){
					this._interval = imagesBoxWidth;
				}
				else if(settings.intervalType == 'image'){
					this._interval = image.width() + settings.padding * 2;
				}
			}
			else if(settings.direction == 'V'){
				imagesBoxWidth = image.width();
				imagesBoxHeight = (image.height() * settings.showImageCount) + (settings.showImageCount * settings.padding) * 2;
				imagesWidth = imagesBoxWidth;
				imagesHeight = (image.height() * li.length) + (li.length * settings.padding) * 2;
				imageWidth = image.width();
				imageHeight = image.height();
				if(!settings.preHtml){
					preButton.html('pre');
					preButton.css({
						width: imagesBoxWidth,
						height: '20px',
						fontSize: '15px',
						textAlign: 'center',
						color: 'black'
					});
				}
				if(!settings.nextHtml){
					nextButton.html('next');
					nextButton.css({
						width: imagesBoxWidth,
						height: '20px',
						fontSize: '15px',
						textAlign: 'center',
						color: 'black'
					});
				}
				li.css({
					width: imageWidth,
					height: imageHeight,
					paddingTop: settings.padding,
					paddingRight: 0,
					paddingBottom: settings.padding,
					paddingLeft: 0
				});
				targetWidth = imagesBoxWidth;
				targetHeight = imagesBoxHeight + preButton.height() + nextButton.height();
				if(settings.intervalType == 'show'){
					this._interval = imagesBoxHeight;
				}
				else if(settings.intervalType == 'image'){
					this._interval = image.height() + settings.padding * 2;
				}
			}

			$(target).css({
				width: targetWidth,
				height: targetHeight
			});
			imagesBox.css({
				width: imagesBoxWidth,
				height: imagesBoxHeight
			});
			ul.addClass('felix-ul');
			li.addClass('felix-li');
			li.find('img').addClass('felix-img');
			ul.css({
				width: imagesWidth,
				height: imagesHeight
			});
		},
		_wrapping: function (target, settings){
			$(target).wrap('<div class="felix-slider"><div class="felix-images-box"></div></div>');
			var wrapper = $('.felix-slider');
			wrapper.prepend('<div class="felix-button felix-pre-button"></div>');
			wrapper.append('<div class="felix-button felix-next-button"></div>');

			if(settings.preHtml){
				wrapper.find('.felix-pre-button').html(settings.preHtml);
			}
			if(settings.nextHtml){
				wrapper.find('.felix-next-button').html(settings.nextHtml);
			}
			return wrapper.get(0);
		},
		_optionFelixSlider: function (target, name, value){
			var slider = $(target).parent().parent().get(0);
			var inst = this._getInst(slider);
			
			if(!inst){
				return false;
			}
			if(arguments.length == 2 && typeof name == 'string'){
				return (
					name == 'defaults' ? $.extend({}, $.datepicker._defaults) : (
						inst ? (
							name == 'all' ? $.extend({}, inst.settings) : this._get(inst, name)
						) : null
					)
				);
			}

			var settings = name || {};
			if(typeof name == 'string'){
				settings = {};
				settings[name] = value;
			}
			if(inst){
				extendRemove(inst.settings, settings);
				this._cssSettings(slider, inst.settings);
			}
		},
		_destroyMethodFelixSlider: function (target){
			$(target).parent().siblings().remove();
			$(target).unwrap().unwrap();
			$(target).removeClass('felix-ul');
			$(target).css({
				width: 'auto',
				height: 'auto',
				border: 0
			});
			$(target).find('li').removeClass('felix-li felix-float');
			$(target).find('img').removeClass('felix-img');
		}
	});

	$.fn.felixSlider = function (option){
		if(!this.length){
			return this;
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);

		if(typeof option == 'string' && otherArgs.length > 1 && option == 'option'){
			return $.felixSlider['_' + option + 'FelixSlider'].apply($.felixSlider, [this[0]].concat(otherArgs));
		}
		if(typeof option == 'string' && option != 'option' && $.felixSlider._method[option] && arguments.length == 1){
			return $.felixSlider['_' + option + 'MethodFelixSlider'].apply($.felixSlider, [this[0]].concat(otherArgs));
		}
		return this.each(function (){
			$.felixSlider._attachFelixSlider(this, option);
		});
	};

	function extendRemove(target, props) {
		$.extend(target, props);
		for(var name in props)
		if(props[name] == null || props[name] == undefined)
			target[name] = props[name];
		return target;
	}

	$.felixSlider = new FelixSlider();
	$.felixSlider.director = director;
	$.felixSlider.version = version;
	$.felixSlider.base = base;


})(jQuery);