Globe = function(p) {

	p.resizeHandler = function() {
		var width = this.offsetWidth;
		var height = this.offsetHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	};

	p.load = function() {
		var geocodes = tsunami.load.json("geocodes.json");
		var mapImage = tsunami.load.image("images/earth_black.png");
		var pinImage = tsunami.load.image("images/pin.png");
		//var glowImage = tsunami.load.image("images/glow.png");
		var borders = tsunami.load.json("borders.json");
		var maps = tsunami.load.json("maps.json");
		var promise = Promise.all([geocodes, mapImage, borders, maps, pinImage]);
		return promise.then(this.loadComplete.bind(this));
	};

	p.loadComplete = function(assets) {
		this.geocodes = assets[0];
		this.mapImage = assets[1];
		this.borders = assets[2];
		this.maps = assets[3];
		this.pinImage = assets[4];
		//this.glowImage = assets[5];

		var pinTexture = new THREE.Texture(this.pinImage);
		pinTexture.needsUpdate = true;
		var pinGeo = new THREE.PlaneBufferGeometry(0.064, 0.064);
		var pinMaterial = new THREE.MeshPhongMaterial({map:pinTexture, transparent:true, side:THREE.DoubleSide});
		this.pin = new THREE.Mesh(pinGeo, pinMaterial);

		this.renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
		this.renderer.setPixelRatio( window.devicePixelRatio || 1);
		this.renderer.setSize(this.offsetWidth, this.offsetHeight);
		this.appendChild(this.renderer.domElement);
		this.renderer.domElement.style.position = "absolute";
		//this.renderer.domElement.style.opacity = GlobeConfig.sphere.opacity;
		this.renderer.shadowMap.enabled = true;
		this.renderer.autoClear = false; // To allow render overlay on top of sprited sphere

		/*
		this.renderer2 = new THREE.WebGLRenderer({alpha:true, antialias:true});
		this.renderer2.setPixelRatio( window.devicePixelRatio || 1);
		this.renderer2.setSize(this.offsetWidth, this.offsetHeight);
		this.renderer2.domElement.style.position = "absolute";
		this.appendChild(this.renderer2.domElement);
		this.renderer2.shadowMap.enabled = true;
		*/

		this.scene = new THREE.Scene();

		this.orbitalCamera = new LatLngCamera(0, 0, 1.5);
		this.camera = this.orbitalCamera.camera;
		this.camera.aspect = this.offsetWidth / this.offsetHeight;
		this.camera.updateProjectionMatrix();

		this.scene.add(this.orbitalCamera);

		var ambient = new THREE.AmbientLight(GlobeConfig.ambientLightColor);
		this.scene.add(ambient);

		var light = new THREE.DirectionalLight(GlobeConfig.light.color, GlobeConfig.light.intensity);
		this.scene.add(light);
		light.position.set(5,5,5);
		light.castShadow = true;

		this.globe = new PlaneSphere(0, 0, this.mapImage, this.borders, this.maps, this);



/*
		// create custom material from the shader code above
		//   that is within specially labeled script tags
		var customMaterial = new THREE.ShaderMaterial({
			uniforms: {
				c: {type: "f", value: 0.1},
				p: {type: "f", value: 0.5},
				glowColor: {type: "c", value: new THREE.Color(GlobeConfig.glow.color)},
				viewVector: {type: "v3", value: this.camera.position}
			},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			transparent: true
		});
		customMaterial.depthTest = false;
		customMaterial.depthWrite = false;

		this.moonGlow = new THREE.Mesh(this.globe.sphereGeo, customMaterial);
		this.moonGlow.scale.multiplyScalar(GlobeConfig.glow.scale);
		this.scene.add(this.moonGlow);
*/
		this.scene.add(this.globe);


		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		this.addEventListener( 'click', this.clickHandler.bind(this));
		window.addEventListener("resize", this.resizeHandler.bind(this));

		this.uniforms = {
			c:new tsunami.Number(0),
			p:new tsunami.Number(5500),
			cDivided:new tsunami.Number(1),
			pDivided:new tsunami.Number(1)

		};

		//tsunami.applyDirectives(document.body, this);
	};

	p.show = function() {

	};

	p.hide = function() {

	};

	p.render = function() {
		/*
		this.moonGlow.position.copy(this.globe.position);
		this.uniforms.cDivided.value = this.uniforms.c.value / 2000;
		this.uniforms.pDivided.value = this.uniforms.p.value / 1000;
		this.moonGlow.material.uniforms.c.value = this.uniforms.cDivided.value;
		this.moonGlow.material.uniforms.p.value = this.uniforms.pDivided.value;
		this.moonGlow.material.uniforms.viewVector.value = new THREE.Vector3(-1.6, 0, 0);//new THREE.Vector3().subVectors(this.camera.position, this.globe.position);
		*/
		//this.globe.glow.lookAt(this.orbitalCamera.position);
		this.orbitalCamera.update();
		//this.globe.glow.lookAt( this.globe.glow.worldToLocal( this.orbitalCamera.matrixWorld.getPosition() ) );

		this.renderer.clear();
		//this.scene.add(this.moonGlow);
		//this.renderer.render(this.scene, this.camera);
		//this.scene.remove(this.moonGlow);
		//this.scene.add(this.globe);
		//this.globe.setForSphere();
		this.renderer.render(this.scene, this.camera);
		//this.globe.setForDots();
		//this.renderer2.render(this.scene, this.camera);
	};

	p.getBranch = function(id) {
		var branch;
		switch(id) {
			case "join-us":
				branch = new JoinUs();
				break;
			case "branding-interstitial":
				branch = new BrandingInterstitial();
				break;
			case "travel":
				branch = new Travel();
				break;
			case "general-title":
				branch = new GeneralTitle();
				break;
			case "gameboard":
				branch = new Gameboard();
				break;
			case "test":
				branch = new Test();
				break;
		}
		return branch;
	};

	p.clickHandler = function(event) {
		event.preventDefault();

		this.mouse.x = (event.pageX - this.renderer.domElement.offsetWidth / 2) / (this.renderer.domElement.offsetWidth / 2);
		this.mouse.y = -(event.pageY - this.renderer.domElement.offsetHeight / 2) / (this.renderer.domElement.offsetHeight / 2);

		//console.log(this.mouse.x, this.mouse.y);

		this.raycaster.setFromCamera( this.mouse, this.camera );

		var intersects = this.raycaster.intersectObject( this.globe.planeMesh );

		if ( intersects.length > 0 ) {
			var intersect = intersects[ 0 ];
			//var dot = this.globe.getDotNearPoint(intersect.point);
			var dot = this.globe.getDotNearPoint(intersect.face.normal);
			console.log(dot.index);
		} else {

		}

	};

	p.highlighCountries = function() {
		this.globe.deselectCountries();
		this.selectedCountries = [];
		if (this.router.parameters.countries) {
			var countries = this.router.parameters.countries.split(",");
			for (var i = 0; i < countries.length; i++) {
				var id = countries[i];
				var country = this.getCountryById(id);
				this.selectedCountries.push(country);
				this.globe.selectCountry(country.name);
			}
		}
	};

	p.getCountryById = function(id) {
		return this.geocodes.countries.filter(function (country) {
			return country.code === id;
		})[0];
	};

	return p;

};
