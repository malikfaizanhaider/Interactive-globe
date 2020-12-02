(function() {

	GeneralTitle = function() {};

	var p = GeneralTitle.prototype;

	p.show = function() {
		this.root.highlighCountries();
		this.renderBind = this.render.bind(this);
		tsunami.clock.addEventListener("tick", this.renderBind);
		this.root.orbitalCamera.radius = 0.9;
		this.root.globe.position.x = 0;
		this.root.globe.position.y = 0;
		this.root.globe.position.z = 0;
		this.root.globe.latitude = 0;
		this.root.globe.longitude = 0;
		this.render();
		return tsunami.promise.timeout(1000).then(this.zoomOut.bind(this));
	};

	p.zoomOut = function() {
		return new tsunami.TimeTween(0, 3, this.root.orbitalCamera, {radius:[0.9, 0.7]}, null, tsunami.easing.Cubic.easeInOut).start();
	};

	p.render = function() {
		this.root.globe.longitude -= 0.2;
		this.root.render();
	};

	p.hide = function() {
		tsunami.clock.removeEventListener("tick", this.renderBind);
	};

}());