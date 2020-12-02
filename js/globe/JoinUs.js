(function() {

	JoinUs = function() {};

	var p = JoinUs.prototype;

	p.show = function() {
		this.root.highlighCountries();
		this.renderBind = this.render.bind(this);
		tsunami.clock.addEventListener("tick", this.renderBind);
		this.root.camera.fov = 1;
		this.root.camera.updateProjectionMatrix();
		this.root.orbitalCamera.radius = 32;
		this.root.globe.latitude = 30;
		this.root.globe.position.x = 0;
		this.root.globe.position.y = -0.1;
		this.root.globe.position.z = -0.05;
		this.render();
	};

	p.render = function() {
		this.root.globe.longitude -= 0.2;
		this.root.render();
	};

	p.hide = function() {
		this.root.camera.fov = 45;
		this.root.camera.updateProjectionMatrix();
		tsunami.clock.removeEventListener("tick", this.renderBind);
	};

}());
