(function ($, undefined){
	var PROP_NAME = 'FelixSlider';
	var director = 'Felix Sungchul Kang';
	var version = '1.02';
	var base = 'jquery-1.7.2';

	function FelixSlider(){
		this.debug = false;
		this.director = director;
		this.version = version;
		this._curInst = null;
		this._method = {
			destroy: true,
			previous: true,
			next: true
		};
		this._defaults = {
			_cursor: 1,					// current page cursor
			_interval: 0,				// move width or height interval.
			_eventDone: true,			// event whether done or not.
			_userCallBack: null,		// user's callback function.
			_currentEvent: null,		// click or previous or next.
			_backState: false,			// back action state.
			extraWidth: 0,				// Extra width.
			extraHeight: 0,				// Extra height.
			auto: false,				// auto action. true(auto slide) or false(manual slide).
			autoReverse: false,			// auto direct reverse. true(auto direction reverse) or false(auto direction don't reverse).
			buttonShow: true,			// button whether show or not. true(show) or false(hide).
			rolling: false,				// image rolling setting. true(rolling) or false(no rolling).
			rollingCopy: true,			// if image count few than showImageCount, same images copy more than showImageCount * 2. if this option is false, it doesn't rolling.
			interval: 3000,				// auto move interval time. integer values.
			duration: 'slow',			// move duration time
			reverse: false,				// button action reverse. 'slow' or 'fast' or integer values.
			direction: 'H', 			// image listing direction V : Vertical, H : Horizental
			showImageCount: 5, 			// image view count
			padding: 2, 				// padding
			preClick: null, 			// function (state) {} : state is success or failure of moving
			nextClick: null, 			// function (state) {} : state is success or failure of moving
			imageClick: null, 			// function (target) {} : target is clicked image
			preHtml: null, 				// preButton design html
			nextHtml: null, 			// nextButton design html
			intervalType: 'show' 		// 'show' is to move imagesBox, 'image' is to move one image.
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
		_getOptionFelixSlider: function (target, option){
			try{
				var inst = $.data(target, PROP_NAME);
				return inst.settings[option];
			}
			catch(err){
				return 'This is not instace of FelixSlider';
			}
		},
		_attachFelixSlider: function (target, settingsArgs){
			$.felixSlider.log(this.debug);

			if(this.debug && $('#sliderLogDiv').length === 0){
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
			$.data(target, PROP_NAME, inst);

			this._imagesSetup(target, inst.settings);
			this._cssSettings(slider, inst.settings);
			this._eventsSettings(slider, inst.settings);
			this._autoSetting(target, inst.settings);

			inst.felixSlider = this;

			this._curInst = inst;
		},
		_imagesSetup: function (target, settings){
			var images = $(target);
			if(images.children().length < settings.showImageCount * 2 && settings.rollingCopy){
				while(images.children().length < settings.showImageCount * 2){
					images.append(images.html());
				}
			}
		},
		_eventsSettings: function (target, settings){
			var preButton = $(target).find('.felix-pre-button');
			var nextButton = $(target).find('.felix-next-button');
			var imageButton = $(target).find('img');
			var imagesUL = $(target).find('.felix-ul');
			var self = this;

			preButton.click(function (){
				if(settings.reverse){
					imagesUL.felixSlider('next');
				}
				else{
					imagesUL.felixSlider('previous');
				}
			});
			nextButton.click(function (){
				if(settings.reverse){
					imagesUL.felixSlider('previous');
				}
				else{
					imagesUL.felixSlider('next');
				}
			});
			imageButton.click(function (){
				if(settings._eventDone){
					settings._currentEvent = 'click';
					settings._eventDone = false;
					self._imageClick(this, settings);
					settings._eventDone = true;
				}
			});
		},
		_preClick: function (target, settings){
			if(settings._eventDone){
				var state = false;
				var imageCount = $(target).find('img').length;
				var maxCursor = settings.intervalType == 'show' ? Math.ceil(imageCount / settings.showImageCount) : settings.reverse ? imageCount + settings.showImageCount - 1 : imageCount;
				var pass = settings.rolling ? $(target).children().length < settings.showImageCount * 2 ? false : true : settings.reverse ? settings._cursor < maxCursor : settings._cursor > 1;

				settings._currentEvent = 'previous';

				if(pass){

					var prefix = '';
					if(settings.reverse){
						prefix = '-=';
					}
					else{
						prefix = '+=';
					}
					var moveTo = prefix + settings._interval;

					settings._userCallBack = settings.preClick;

					this._autoRoller(target, moveTo, settings);
					
					state = true;
				}
				if(settings.preClick){
					settings.preClick(state);
				}
			}
		},
		_nextClick: function (target, settings){
			if(settings._eventDone){
				var state = false;
				var imageCount = $(target).find('img').length;
				var maxCursor = settings.intervalType == 'show' ? Math.ceil(imageCount / settings.showImageCount) : settings.reverse ? imageCount : imageCount + settings.showImageCount - 1;
				var pass = settings.rolling ? $(target).children().length < settings.showImageCount * 2 ? false : true : settings.reverse ? settings._cursor > 1 : settings._cursor < maxCursor;

				settings._currentEvent = 'next';

				if(pass){
					if(settings.reverse){
						prefix = '+=';
					}
					else{
						prefix = '-=';
					}
					var moveTo = prefix + settings._interval;

					settings._userCallBack = settings.nextClick;
					this._autoRoller(target, moveTo, settings);
					
					state = true;
				}
				if(settings.nextClick){
					settings.nextClick(state);
				}
			}
		},
		_imageClick: function (target, settings){
			if(settings.imageClick){
				var clone = $(target).clone();
				settings.imageClick(clone);
			}
		},
		_autoRoller: function (target, moveTo, settings){
			settings._eventDone = false;

			var ul = $(target);
			var moveCount = settings.intervalType == 'image' ? 1 : settings.showImageCount;
			var moveImages;
			var exceptCount = ul.children().length - moveCount;
			var oneInterval = settings._interval / settings.showImageCount;
			var self = this;

			var roller = function (){
				var moveState = false;
				if(settings.rolling && !settings._backState){
					if(settings.autoReverse){
						self._position(target, settings);
					}
					else{
						moveImages = ul.find('li:lt(' + moveCount + ')');
						ul.css({
							top: 0,
							left: 0
						});
						moveImages.appendTo(target);
					}
					moveState = true;
				}
				
				switch(settings._currentEvent){
					case 'previous':
						settings.reverse ? settings._cursor++ : settings._cursor--;
						break;
					case 'next':
						settings.reverse ? settings._cursor-- : settings._cursor++;
						break;
				}

				settings._eventDone = true;
				settings._currentEvent = null;
				settings._backState = false;
				if(settings._userCallBack){
					settings._userCallBack(moveState);
					settings._userCallBack = null;
				}
			};

			if(settings.rolling){
				switch(settings._currentEvent){
					case 'previous':
						if(!settings.autoReverse){
							settings._backState = true;
							this._position(target, settings);	
						}
						break;
					case 'next':
						if(settings.autoReverse){
							settings._backState = true;
							this._position(target, settings);
						}
						break;
				}
			}

			switch(settings.direction){
				case 'H':
					ul.animate({
						left: moveTo
					}, {
						duration: settings.duration,
						complete: roller
					});
					break;
				case 'V':
					ul.animate({
						top: moveTo
					}, {
						duration: settings.duration,
						complete: roller
					});
					break;
			}
		},
		_autoSetting: function (target, settings){
			if(settings.autoReverse){
				var moveCount = settings.showImageCount;
				var moveImages = $(target).find('li:gt(' + (moveCount - 1) + ')');
				moveImages.prependTo(target);
				settings._cursor = Math.ceil($(target).children().length / (settings.intervalType == 'show' ? settings.showImageCount : 1));
				var position = {};
				var oneInterval = settings.intervalType == 'show' ? settings._interval / settings.showImageCount : settings._interval;
				if(settings.direction == 'H'){
					position.top = 0;
					position.left = oneInterval * moveImages.length;
					position.left = -position.left;
				}
				else if(settings.direction == 'V'){
					position.top = oneInterval * moveImages.length;
					position.left = 0;
					position.top = -position.top;
				}
				$(target).css({
					top: position.top,
					left: position.left
				});	
				if(settings.auto){
					if(settings.reverse){
						setInterval(function (){
							if(settings._eventDone){
								$(target).felixSlider('next');
							}
						}, settings.interval);
					}
					else{
						setInterval(function (){
							if(settings._eventDone){
								$(target).felixSlider('previous');
							}
						}, settings.interval);					
					}
				}
			}
			else{
				if(settings.auto){
					if(settings.reverse){
						setInterval(function (){
							if(settings._eventDone){
								$(target).felixSlider('previous');
							}
						}, settings.interval);
					}
					else{
						setInterval(function (){
							if(settings._eventDone){
								$(target).felixSlider('next');
							}
						}, settings.interval);					
					}
				}

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

			li.width(li.width() + settings.extraWidth);
			li.height(li.height() + settings.extraHeight);

			if(settings.direction == 'H'){
				li.addClass('felix-float');
				imagesBoxWidth = (li.width() * settings.showImageCount) + (settings.showImageCount * settings.padding) * 2;
				imagesBoxHeight = li.height();
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
				$(target).width(imagesBoxWidth + preButton.width() + nextButton.width());
				if(settings.intervalType == 'show'){
					settings._interval = imagesBoxWidth;
				}
				else if(settings.intervalType == 'image'){
					settings._interval = imagesBoxWidth / settings.showImageCount;
				}
			}
			else if(settings.direction == 'V'){
				imagesBoxWidth = li.width();
				imagesBoxHeight = (li.height() * settings.showImageCount) + (settings.showImageCount * settings.padding) * 2;
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
					paddingTop: settings.padding,
					paddingRight: 0,
					paddingBottom: settings.padding,
					paddingLeft: 0
				});
				targetWidth = imagesBoxWidth;
				targetHeight = imagesBoxHeight + preButton.height() + nextButton.height();
				$(target).width(imagesBoxWidth);
				if(settings.intervalType == 'show'){
					settings._interval = imagesBoxHeight;
				}
				else if(settings.intervalType == 'image'){
					settings._interval = imagesBoxHeight / settings.showImageCount;
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
			var wrapper = $(target).parent().parent();

			if(settings.buttonShow){
				wrapper.prepend('<div class="felix-button felix-pre-button"></div>');
				wrapper.append('<div class="felix-button felix-next-button"></div>');
			}

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
			var inst = this._getInst(target);
			
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
		},
		_previousMethodFelixSlider: function (target){
			var inst = this._getInst(target);
			// if(inst.settings._eventDone){
			// 	inst.settings._eventDone = false;
				this._preClick(target, inst.settings);
			// }
		},
		_nextMethodFelixSlider: function (target){
			var inst = this._getInst(target);
			// if(inst.settings._eventDone){
			// 	inst.settings._eventDone = false;
				this._nextClick(target, inst.settings);
			// }
		},
		_position: function (target, settings){
			var ul = $(target);
			var moveCount = settings.intervalType == 'image' ? 1 : settings.showImageCount;
			var moveImages;
			var exceptCount = ul.children().length - moveCount;
			var oneInterval = settings._interval / settings.showImageCount;
			var position = {};

			switch((settings.rolling ^ settings.autoReverse) ^ settings._backState){
				case 0:
					moveImages = ul.find('li:gt(' + (exceptCount - 1) + ')');
					moveImages.prependTo(target);
					break;
				case 1:
					moveImages = ul.find('li:lt(' + moveCount + ')');
					moveImages.appendTo(target);
					break;
			}
			
			switch(settings.direction){
				case 'H':
					position.top = 0;
					position.left = settings.autoReverse ? settings._backState ? 0 : oneInterval * exceptCount : settings._interval;
					position.left = -position.left;
					break;
				case 'V':
					position.top = settings.autoReverse ? settings._backState ? 0 : oneInterval * exceptCount : settings._interval;
					position.left = 0;
					position.top = -position.top;
					break;
			}
			// alert(11);
			$(target).css({
				top: position.top,
				left: position.left
			});
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
		if(typeof option == 'string' && otherArgs.length == 1 && option == 'option'){
			return $.felixSlider['_getOptionFelixSlider'].apply($.felixSlider, [this[0]].concat(otherArgs));
		}
		if(typeof option == 'string' && option != 'option' && $.felixSlider._method[option]){
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