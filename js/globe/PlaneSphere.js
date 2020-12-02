(function() {

	PlaneSphere = function(latitude, longitude, worldMap, borders, maps, root, glowImage) {
		THREE.Object3D.call(this);

		this.axisY = new THREE.Object3D();
		this.add(this.axisY);

		var texture = new THREE.Texture(worldMap);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		var sphereGeo = new THREE.SphereGeometry(0.5, 64, 32);
		var sphereGeo = new THREE.IcosahedronGeometry( 0.5, 4);
		this.sphereGeo = sphereGeo;
		var material = new THREE.MeshPhongMaterial({map:texture, transparent: true, opacity: 1});
		var material = new THREE.MeshPhongMaterial({color:GlobeConfig.sphere.color, transparent: true});
		material.depthTest = false;
		material.depthWrite = false;

		var sphere = new THREE.Mesh(sphereGeo, material);
		sphere.rotation.y = 0;
		this.axisY.add(sphere);
		this.sphereMesh = sphere;








/*
		var glowTexture = new THREE.Texture(glowImage);
		glowTexture.needsUpdate = true;
		var glowMaterial = new THREE.SpriteMaterial({map:glowTexture, color: 0x808080, fog: true});
		//glowMaterial.depthTest = false;
		//glowMaterial.depthWrite = false;
		var glowSprite = new THREE.Sprite(glowMaterial);
		glowSprite.scale.set( 1.0875, 1.0875);
		this.axisY.add(glowSprite);
*/

		/*
		var material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			wireframe:true
		});
		*/
		var geometry = new THREE.IcosahedronGeometry( 0.5, 7);
		//var mesh = new THREE.Mesh(geometry, material);
		//this.axisY.add(mesh);

		this.canvas = document.createElement("canvas");
		this.canvas.width = 128;
		this.canvas.height = 64;
		//root.appendChild(this.canvas);
		var ctx = this.canvas.getContext("2d");
		//ctx.fillStyle = "#FF0000";
		//ctx.fillRect(0,0,200,100);

		ctx.globalAlpha = GlobeConfig.dot.normal.opacity;
		ctx.beginPath();
		ctx.arc(32,32,30,0,2 * Math.PI);
		ctx.fillStyle = GlobeConfig.dot.normal.color;
		ctx.fill();

		ctx.globalAlpha = GlobeConfig.dot.selected.opacity;
		ctx.beginPath();
		ctx.arc(96,32,30,0,2 * Math.PI);
		ctx.fillStyle = GlobeConfig.dot.selected.color;
		ctx.fill();

		var texture = new THREE.Texture(this.canvas);
		texture.needsUpdate = true;

		this.planeGeo = new PlaneSphereGeometry(geometry, worldMap, borders, maps, root);

		/*
		document.body.onclick = function() {
			var array = this.planeGeo.attributes.uv.array;
			var newUVs = [0, 1, 0.5, 1, 0, 0, 0.5, 0];
			for (var i = 0; i < newUVs.length; i++) {
				array[i] = newUVs[i];
			}
		 this.planeGeo.attributes.uv.needsUpdate = true;
		};
		*/

		//var planeMaterial = new THREE.MeshPhongMaterial({map:texture, transparent:true, side:THREE.DoubleSide});
		var planeMaterial = new THREE.MeshPhongMaterial({map:texture, transparent:true});
		planeMaterial.depthTest = false;
		planeMaterial.depthWrite = false;
		var planeMesh = new THREE.Mesh(this.planeGeo, planeMaterial);
		this.axisY.add(planeMesh);
		this.planeMesh = planeMesh;

		/*
		var planeGeo = new THREE.PlaneGeometry( 0.055, 0.055);
		var axis = new THREE.Vector3(0, 0, 1);
		for (var i = 0; i < geometry.vertices.length; i++) {
			var vertice = geometry.vertices[i];
			var plane = new THREE.Mesh( planeGeo, material );
			plane.quaternion.setFromUnitVectors(axis, vertice.clone().normalize());
			plane.position.copy(vertice.clone());
			this.axisY.add(plane);
		}
		*/

		//var fnh = new THREE.FaceNormalsHelper( this.mesh, 0.1 );
		//this.axisY.add( fnh );

		this.latitude = (!isNaN(latitude))?latitude:0;
		this.longitude = (!isNaN(longitude))?longitude:0;
	};

	var p = PlaneSphere.prototype = Object.create(THREE.Object3D.prototype);

	p.constructor = PlaneSphere;

	p.selectCountry = function(name) {
		return this.planeGeo.selectCountry(name);
	};

	p.deselectCountries = function() {
		this.planeGeo.deselectCountries();
	};

	p.getDotNearPoint = function(vector) {
		var closestDot;
		var closestDistance = 10000000000000;
		for (var i = 0; i < this.planeGeo.dots.length; i++) {
			var dot = this.planeGeo.dots[i];
			var distance = dot.vector.distanceTo(vector);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestDot = dot;
				//console.log("distance", distance, "dot", dot);
			}
		}
		return closestDot;
	};

	p.getDotNearNormal = function(normal) {
		var closestDot;
		for (var i = 0; i < this.planeGeo.dots.length; i++) {
			var dot = this.planeGeo.dots[i];
			if (normal.equals(dot.normal)) {
				closestDot = dot;
			}
		}
		return closestDot;
	};

	p.setForSphere = function() {
		this.axisY.remove(this.planeMesh);
		this.axisY.add(this.sphereMesh);
	};

	p.setForDots = function() {
		this.axisY.remove(this.sphereMesh);
		this.axisY.add(this.planeMesh);
	};

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
			this.rotation.z = -value * Math.PI / 180;
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
			this.axisY.rotation.y = -value * Math.PI / 180;
		}
	});

}());
