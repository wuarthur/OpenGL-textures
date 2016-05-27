// Shared variables
varying vec4 l;
varying vec4 v_viewPosition;
varying vec4 v_normal;

// Constants

// Lighting Properties
uniform vec3 lightDirection;

void main() {
	// Normalize vectors used in lighting computations and make sure they are all
	// in the view coordinate system
	v_normal = vec4(normalize(normalMatrix*normal), 0.0);
	v_viewPosition = modelViewMatrix * vec4(position, 0.0);
	l = viewMatrix * vec4(normalize(lightDirection), 0.0);
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}