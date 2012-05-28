Logger = function(container) {
	this.container = container;
	this.textarea = container.find('textarea');
};

Logger.prototype.log = function(value) {
	this.textarea.val(this.textarea.val() + '\n' + value);
	this.textarea[0].scrollTop = this.textarea[0].scrollHeight;
};

Arduino = function(logger) {
	this.subscribers = [];
	this.logger = logger;
};

Arduino.prototype.processingPostRequest = false;

Arduino.prototype.post = function(message) {
	this.logger.log('posting: ' + message);
	
	if(!this.processingPostRequest) {
		this.logger.log('starting post request');
		this.processingPostRequest = true;
		$.ajax({
			type: 'post',
			url: '/'
		}).success($.proxy(this.postMessage, this));
		return true;
	} else {
		return false;
	}
};

Arduino.prototype.postMessage = function(response) {
	this.processingPostRequest = false;
	this.logger.log('post request complete');
	this.logger.log('received: ' + response);
	i = this.subscribers.length;
	while(i--) {
		this.subscribers[i](response);
	}
};

Arduino.prototype.subscribe = function(callback) {
	this.subscribers.push(callback);
};

Controller = function(container, arduino) {
	this.container = container;
	this.arduino = arduino;
	this.container.delegate('li', 'touchstart', $.proxy(this.handleClick, this));
};

Controller.prototype.handleClick = function(e) {
	var target = $(e.currentTarget);
	arduino.post(target.attr('class'));
};
