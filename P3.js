/**
 * UBC CPSC 314, January 2016
 * Project 3 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(10,15,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightPosition = new THREE.Vector3(70,100,70);

var kA = 0.4;
var kD = 0.8;
var kS = 0.8;
var s = 10.0;

// MATERIALS
var defaultMaterial = new THREE.MeshLambertMaterial();
var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightColor : {type : 'c', value: lightColor},  // I_l
    ambientColor : {type : 'c', value: ambientColor}, //I_a
    lightPosition : {type: 'v3', value: lightPosition},  // L
  },
});
var gouraudMaterial = new THREE.ShaderMaterial({
  uniforms: {
    // Color and Vector
    lightDirection : {type : 'v3', value: lightPosition},
    lightColor : {type : 'c', value: lightColor},
    ambientColor : {type : 'c', value: ambientColor},

    kAmbient : {type : 'f', value: kA},
    kDiffuse : {type : 'f', value: kD},
    kSpecular : {type : 'f', value: kS},
    shininess : {type : 'f', value: s},
  },
});
var phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightDirection : {type : 'v3', value: lightPosition},
    lightColor : {type : 'c', value: lightColor},
    ambientColor : {type : 'c', value: ambientColor},

    kAmbient : {type : 'f', value: kA},
    kDiffuse : {type : 'f', value: kD},
    kSpecular : {type : 'f', value: kS},
    shininess : {type : 'f', value: s},
  },


});
var Cc = new THREE.Color(0,0,1);  // blue
var Cw = new THREE.Color(1,0,0);  // red
var coolToWarmMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightDirection : {type : 'v3', value: lightPosition},
    lightColor : {type : 'c', value: lightColor},
    ambientColor : {type : 'c', value: ambientColor},

    kAmbient : {type : 'f', value: kA},
    kDiffuse : {type : 'f', value: kD},
    kSpecular : {type : 'f', value: kS},
    shininess : {type : 'f', value: s},
  },


});

var blinnMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightDirection : {type : 'v3', value: lightPosition},
    lightColor : {type : 'c', value: lightColor},
    ambientColor : {type : 'c', value: ambientColor},

    kAmbient : {type : 'f', value: kA},
    kDiffuse : {type : 'f', value: kD},
    kSpecular : {type : 'f', value: kS},
    shininess : {type : 'f', value: s},
  },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/example.vs.glsl',
  'glsl/example.fs.glsl',
  'glsl/gouraud.vs.glsl',
  'glsl/gouraud.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/kenny.vs.glsl',
  'glsl/kenny.fs.glsl',
  'glsl/phong-blinn.vs.glsl',
  'glsl/phong-blinn.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/example.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/example.fs.glsl'];
  armadilloMaterial.needsUpdate = true;
  gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
  gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
  gouraudMaterial.needsUpdate = true;
  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  phongMaterial.needsUpdate = true;
  coolToWarmMaterial.vertexShader = shaders['glsl/kenny.vs.glsl'];
  coolToWarmMaterial.fragmentShader = shaders['glsl/kenny.fs.glsl'];
  coolToWarmMaterial.needsUpdate = true;
  blinnMaterial.vertexShader = shaders['glsl/phong-blinn.vs.glsl'];
  blinnMaterial.fragmentShader = shaders['glsl/phong-blinn.fs.glsl'];
  blinnMaterial.needsUpdate = true;
})

// LOAD ARMADILLO
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader()
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = floor;
    scene.add(object);
    //scene.remove(object);
    object.name = "arm";

    //return object.name;

  }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0,3,-2, 0,Math.PI,0);

//var ide = scene.getObjectByName("arm",true);
//scene.remove(ide);


// CREATE SPHERES
var sphere = new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(1, 32, 32));
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

//var gem_phong_blinn_mat = new THREE.MeshBasicMaterial( {color: 0x0fd430 });
var gem_phong_blinn = new THREE.Mesh(sphere, blinnMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

//var gem_toon_mat = new THREE.MeshBasicMaterial( {color: 0xda00e7 });
var gem_toon = new THREE.Mesh(sphere, coolToWarmMaterial);
gem_toon.position.set(3, 1, -1);
scene.add(gem_toon);
gem_toon.parent = floor;

var reload =false;
var reloadmaterial;
// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();
function onKeyDown(event) {
  if (keyboard.eventMatches(event, "1")) {
      reload=true;
    reloadmaterial = gouraudMaterial;
  }

  if (keyboard.eventMatches(event, "2")) {
    reload=true;
    reloadmaterial = phongMaterial;
  }

  if (keyboard.eventMatches(event, "3")) {
    reload=true;
    reloadmaterial = blinnMaterial;
  }

  if (keyboard.eventMatches(event, "4")) {
    reload=true;
    reloadmaterial = coolToWarmMaterial;
  }
}

keyboard.domElement.addEventListener('keydown', onKeyDown );
var render = function() {
  if(reload) {
    var ide = scene.getObjectByName("arm", true);
    scene.remove(ide);
    loadOBJ('obj/armadillo.obj', reloadmaterial, 3, 0, 3, -2, 0, Math.PI, 0);
    reload = false;
  }


  // tip: change armadillo shading here according to keyboard

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();