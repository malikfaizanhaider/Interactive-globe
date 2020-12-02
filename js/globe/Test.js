(function() {

	Test = function() {};

	var p = Test.prototype;

	p.show = function() {
		this.renderBind = this.render.bind(this);
		tsunami.clock.addEventListener("tick", this.renderBind);
		this.root.orbitalCamera.radius = 1.6;
		this.root.globe.latitude = 40;
		this.root.globe.longitude = 0;
		this.root.globe.position.y = 0.03;
		this.render();

		/*
		var canvas = document.createElement("canvas");
		this.canvas = canvas;
		canvas.id = "debugMap";
		canvas.width = this.root.mapImage.width;
		canvas.height = this.root.mapImage.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this.root.mapImage, 0, 0);
		document.body.appendChild(canvas);
		*/

	};

	p.render = function() {
		this.root.globe.longitude -= 0.2;
		this.root.render();
	};

	p.hide = function() {
		tsunami.clock.removeEventListener("tick", this.renderBind);
	};

}());
