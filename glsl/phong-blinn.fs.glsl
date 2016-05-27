// Shared variables
varying vec4 l;
varying vec4 v_viewPosition;
varying vec4 v_normal;

// Constants
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// Lighting Properties
uniform vec3 lightColor;	// I_l
uniform vec3 ambientColor;	// I_a

void main() {
	vec4 ambient; // kA * I_a
	vec4 diffuse; // kD * I_l * (n dot l)
	vec4 specular; // kS * I_l * (h dot n)^(shininess) , where h is the halfway vector b/w L
					// and the surface normal
	
	// Compute the halfway vector between light and viewing direction
	vec4 h = 0.5 * (l + v_viewPosition);
	
	// Compute ambient, diffuse, specular
	ambient = kAmbient * vec4(ambientColor, 1.0);
	diffuse = kDiffuse * dot(v_normal, l) * vec4(lightColor, 1.0);
	float s = pow(abs(dot(h, v_normal)), shininess);
	vec4 sp = vec4(s, s, s, 1.0);
	specular = kSpecular * sp * vec4(lightColor, 1.0);
	
	// Compute Phong Illumination equation
	gl_FragColor = ambient + diffuse + specular;
}