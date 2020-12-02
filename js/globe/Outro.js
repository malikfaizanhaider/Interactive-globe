(function() {

	Outro = function() {};

	var p = Outro.prototype;

	p.show = function() {
		this.root.highlighCountries();
		this.renderBind = this.render.bind(this);
		tsunami.clock.addEventListener("tick", this.renderBind);
		this.root.orbitalCamera.radius = 1.4;
		this.root.globe.position.x = 0;
		this.root.globe.position.y = 0;
		this.root.globe.position.z = 0;
		this.root.globe.latitude = 0;
		this.render();
	};

	p.render = function() {
		this.root.globe.longitude -= 0.15;
		this.root.render();
	};

	p.hide = function() {
		tsunami.clock.removeEventListener("tick", this.renderBind);
	};

}());