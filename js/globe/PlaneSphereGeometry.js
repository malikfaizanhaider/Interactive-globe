(function() {

	PlaneSphereGeometry = function (icosahedron, worldMap, borders, maps, root) {

		THREE.BufferGeometry.call( this );

		this.type = 'PlaneSphereGeometry';
		this.borders = borders;
		this.maps = maps;
		/*
		var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
		var uvs = [0, 1, 1, 1, 0, 0, 1, 0]
		var indices = [0, 2, 1, 2, 3, 1]
		*/

		var canvas = document.createElement("canvas");
		this.canvas = canvas;
		//root.appendChild(canvas);
		canvas.width = worldMap.width;
		canvas.height = worldMap.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(worldMap, 0, 0);
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		var center = new THREE.Vector3();
		this.dots = [];
		for (var i = 0; i < icosahedron.vertices.length; i++) {
			var icoVert = icosahedron.vertices[i];
			var icoVertRotation = new THREE.Vector3();
			icoVertRotation.z = Math.atan2((icoVert.y - center.y), (icoVert.x - center.x));
			icoVertRotation.x = Math.atan2((icoVert.y - center.y), (icoVert.z - center.z));
			icoVertRotation.y = Math.atan2((icoVert.z - center.z), (icoVert.x - center.x));

			var longitude = icoVertRotation.y * -180 / Math.PI;
			var latitude = Math.asin(icoVert.y / 0.5) * -180 / Math.PI;

			var pixelX = Math.round((longitude + 180) / 360 * canvas.width);
			var pixelY = Math.round((latitude + 90) / 180 * canvas.height);

			var index = (pixelY * canvas.width * 4) + (pixelX * 4);
			var r = imageData.data[index];
			var g = imageData.data[index + 1];
			var b = imageData.data[index + 2];

			if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
				var opaque = ((r + b + g) / 3 < 224);
				if (opaque) {
					var dot = {
						vector:icoVert.clone(),
						normal:icoVert.clone().normalize(),
						latlng:[latitude * -1, longitude]
					};
					this.dots.push(dot);
				}
			}

		}

		var dotsLength = this.dots.length;

		var resolution = 7;
		var size;
		switch(resolution) {
			case 4:
				size = 0.015;
				break;
			case 5:
				size = 0.008;
				break;
			case 6:
				size = 0.0045;
				break;
			case 7:
				size = 0.002;
				break;
			case 8:
				size = 0.001;
				break;
		}
		var half = size / 2;

		var width = size;
		var height = size;

		var vertices = new Float32Array( dotsLength * 4 * 3 );
		var normals = new Float32Array( dotsLength * 4 * 3 );
		var uvs = new Float32Array( dotsLength * 4 * 2 );
		var indices = new Uint32Array( dotsLength * 6 );

		var points = [];
		points.push(new THREE.Vector3(-half, half, 0));
		points.push(new THREE.Vector3(half, half, 0));
		points.push(new THREE.Vector3(-half, -half, 0));
		points.push(new THREE.Vector3(half, -half, 0));

		this.uvBase = [
			new THREE.Vector2(0, 1),
			new THREE.Vector3(0.5, 1),
			new THREE.Vector3(0, 0),
			new THREE.Vector3(0.5, 0)
		];

		this.uvSelected = [
			new THREE.Vector2(0.5, 1),
			new THREE.Vector3(1, 1),
			new THREE.Vector3(0.5, 0),
			new THREE.Vector3(1, 0)
		];

		var axisX = new THREE.Vector3(1, 0, 0);
		var axisY = new THREE.Vector3(0, 1, 0);
		var axisZ = new THREE.Vector3(0, 0, 1);
		var vertsName = ["x", "y", "z"];
		this.uvsName = ["x", "y"];
		var indicesBase = [0, 2, 1, 2, 3, 1];

		var vertOffset = 0;
		var uvOffset = 0;
		var indiceOffset = 0;

		for (var p = 0; p < dotsLength; p++) {
			var dot = this.dots[p];
			dot.index = p;
			//dot.uvOffset = uvOffset;
			var icoVert = dot.vector;

			var q = new THREE.Quaternion();
			q.setFromUnitVectors(axisZ, dot.normal);

			for ( var i = 0; i < points.length; i++) {
				var point = points[i].clone();

				point.applyQuaternion(q);

				point.add(icoVert);
				var uvVec = this.uvBase[i];
				var normal = icoVert.clone();
				normal.normalize();
				for (var j = 0; j < vertsName.length; j++) {
					var name = vertsName[j];
					vertices[vertOffset] = point[name];
					normals[vertOffset] = normal[name];
					vertOffset++;
				}
				for (var n = 0; n < 2; n++) {
					var name = this.uvsName[n];
					uvs[uvOffset] = uvVec[name];
					uvOffset++;
				}
			}

			for (var g = 0; g < indicesBase.length; g++) {
				indices[indiceOffset] = indicesBase[g] + p * 4;
				indiceOffset++;
			}

		}
		/*
		console.log("vertices", vertices);
		console.log("normals", normals);
		console.log("uvs", uvs);
		console.log("indices", indices);
		*/

		this.testInPath = [
			new tsunami.geom.Point(1, 0),
			new tsunami.geom.Point(1, 1),
			new tsunami.geom.Point(0, 1),
			new tsunami.geom.Point(-1, 1),
			new tsunami.geom.Point(-1, 0),
			new tsunami.geom.Point(-1, -1),
			new tsunami.geom.Point(0, -1),
			new tsunami.geom.Point(1, -1)
		];

		this.bordersDiv = document.createElement("div");

		this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
		this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	};



	var p = PlaneSphereGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
	p.constructor = PlaneSphereGeometry;

	p.getCountryDots = function(name) {
		var selectedDots = [];

		var dot = [81.966159, -76.212506];
		var dotPoint = this.latlngToPoint(dot);

		var selected;
		for (var i = 0; i < this.borders.length; i++) {
			var country = this.borders[i];
			if (country.Name.toLowerCase() == name.toLowerCase()) {
				selected = country;
			}
		}
		if (selected) {
			//console.log("selected.Name", selected.Name);
			var geometry = selected.geometry;
			this.bordersDiv.innerHTML = selected.geometry;
			var coordinates = this.bordersDiv.querySelectorAll("coordinates");
			var paths = [];
			for (var j = 0; j < coordinates.length; j++) {
				var raw = coordinates[j].innerHTML.split(" ");
				raw = raw.join("");
				var coords = raw.split(",0");
				coords.pop();
				var path = [];
				for (var k = 0; k < coords.length; k++) {
					var pair = coords[k].split(",");
					for (var m = 0; m < pair.length; m++) {
						pair[m] = eval(pair[m]);
					}
					pair.reverse();
					path.push(pair);
				}
				paths.push(path);
			}
		} else {
			console.log("can't find country");
		}
		var ctx = this.canvas.getContext("2d");
		ctx.fillStyle = "#FF0000";
		for (var i = 0; i < paths.length; i++) {
			var coordinates = paths[i];
			ctx.beginPath();
			var point = this.latlngToPoint(coordinates[0]);
			ctx.moveTo(point.x, point.y);
			for (var j = 1; j < coordinates.length; j++) {
				var point = this.latlngToPoint(coordinates[j]);
				ctx.lineTo(point.x, point.y);
			}
			ctx.closePath();
			for (var h = 0; h < this.dots.length; h++) {
				var dot = this.dots[h];
				var included = false;
				var dotPoint = this.latlngToPoint(dot.latlng);
				if (ctx.isPointInPath(dotPoint.x, dotPoint.y)) {
					included = true;
				}
				if (!included) {
					for (var f = 0; f < this.testInPath.length; f++) {
						var testPoint = this.testInPath[f];
						var dotPointTest = dotPoint.add(testPoint);
						if (ctx.isPointInPath(dotPointTest.x, dotPointTest.y)) {
							included = true;
						}
					}
				}
				if (included) {
					selectedDots.push(h);
				}
			}
			ctx.fill();
		}

		return selectedDots;
	};

	p.selectCountry = function(name) {
		var selected;
		for (var i = 0; i < this.maps.length; i++) {
			var country = this.maps[i];
			if (country.name.toLowerCase() == name.toLowerCase()) {
				selected = country;
			}
		}
		if (selected) {
			this.selectDots(selected.dots);
		}
	};

	p.selectDots = function(dots) {
		for (var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			this.selectDot(dot);
		}
		this.attributes.uv.needsUpdate = true;
	};

	p.latlngToPoint = function(latlng) {
		var point = new tsunami.geom.Point();
		point.x = (latlng[1] + 180) / 360 * this.canvas.width;
		point.y = (180 - (latlng[0] + 90)) / 180 * this.canvas.height;
		return point;
	};

	p.deselectCountries = function() {
		for (var h = 0; h < this.dots.length; h++) {
			var dot = this.dots[h];
			this.deselectDot(dot);
		}
		this.attributes.uv.needsUpdate = true;
	};

	p.selectDot = function(dot) {
		var uvs = this.attributes.uv.array;
		var uvOffset = dot * 8;
		for ( var i = 0; i < this.uvSelected.length; i++) {
			var uvVec = this.uvSelected[i];
			for (var n = 0; n < 2; n++) {
				var name = this.uvsName[n];
				uvs[uvOffset] = uvVec[name];
				uvOffset++;
			}
		}
	};

	p.deselectDot = function(dot) {
		var uvs = this.attributes.uv.array;
		var uvOffset = dot.index * 8;
		for ( var i = 0; i < this.uvBase.length; i++) {
			var uvVec = this.uvBase[i];
			for (var n = 0; n < 2; n++) {
				var name = this.uvsName[n];
				uvs[uvOffset] = uvVec[name];
				uvOffset++;
			}
		}
	};

}());