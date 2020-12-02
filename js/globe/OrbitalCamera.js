
(function() {

	OrbitalCamera = function(rotX, rotY, radius) {
		THREE.Object3D.call(this);
		this.container = new THREE.Object3D();

		this.camera = new THREE.PerspectiveCamera();
		this.camera.fov = 45;
		this.camera.near = 0.001;
		this.camera.far = 100;
		this.camera.rotation.y = 90 * Math.PI / 180;
		this.add(this.container);
		this.container.add(this.camera);
		this.rotX = (!isNaN(rotX))?rotX:0;
		this.rotY = (!isNaN(rotY))?rotY:0;
		this.radius = (!isNaN(radius))?radius:1.5;
	};

	var p = OrbitalCamera.prototype = Object.create(THREE.Object3D.prototype);

	p.constructor = OrbitalCamera;

	Object.defineProperty(p, 'rotX', {
		get: function() {
			return this._rotX;
		},
		set: function(value) {
			this._rotX = value;
		}
	});

	Object.defineProperty(p, 'rotY', {
		get: function() {
			return this._rotY;
		},
		set: function(value) {
			this._rotY = value;
		}
	});

	Object.defineProperty(p, 'radius', {
		get: function() {
			return this._radius;
		},
		set: function(value) {
			this._radius = value;
		}
	});

	p.update = function() {
		var radiansX = this.rotX * Math.PI / 180;
		var radiansY = this.rotY * Math.PI / 180;
		var point = tsunami.geom.Vector3D.spherePoint(this.radius, radiansX, radiansY);
		this.position.x = point.x;
		this.position.y = point.y;
		this.position.z = point.z;
		this.container.rotation.z = radiansX;
		this.rotation.y = -radiansY;
	}

}());
