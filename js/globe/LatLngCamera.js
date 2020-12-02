(function() {

	LatLngCamera = function(latitude, longitude, radius) {
		OrbitalCamera.call(this, 0, 0, radius);
		this.latitude = (!isNaN(latitude))?latitude:0;
		this.longitude = (!isNaN(longitude))?longitude:0;
		this.radius = (!isNaN(radius))?radius:1.5;
	};

	var p = LatLngCamera.prototype = Object.create(OrbitalCamera.prototype);

	p.constructor = LatLngCamera;

	Object.defineProperty(p, 'latitude', {
		get: function() {
			return this._latitude;
		},
		set: function(value) {
			while(value > 180) {
				value -= 360;
			}
			while(value < -180) {
				value += 360;
			}
			this._latitude = value;
			this.rotX = value;
		}
	});

	Object.defineProperty(p, 'longitude', {
		get: function() {
			return this._longitude;
		},
		set: function(value) {
			while(value > 180) {
				value -= 360;
			}
			while(value < -180) {
				value += 360;
			}
			this._longitude = value;
			this.rotY = -value;
		}
	});

}());
