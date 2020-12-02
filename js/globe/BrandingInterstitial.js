(function() {

	BrandingInterstitial = function() {};

	var p = BrandingInterstitial.prototype;

	p.show = function() {
		this.root.highlighCountries();
		this.renderBind = this.render.bind(this);
		tsunami.clock.addEventListener("tick", this.renderBind);
		this.root.orbitalCamera.radius = 1.6;
		this.root.globe.latitude = 40;
		this.root.globe.position.x = 0;
		this.root.globe.position.y = 0.03;
		this.root.globe.position.z = 0;
		this.render();
	};

	p.render = function() {
		this.root.globe.longitude -= 0.2;
		this.root.render();
	};

	p.hide = function() {
		tsunami.clock.removeEventListener("tick", this.renderBind);
	};

}());
