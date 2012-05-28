$(function() {
	window.scrollTo(0,1);
	logger = new Logger($('.diagnostics'));
	arduino = new Arduino(logger);
	controller = new Controller($('.controls'), arduino);
});