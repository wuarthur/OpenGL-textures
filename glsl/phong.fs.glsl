// Constants
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// Light Properties
uniform vec3 lightDirection; // use to find l , convert to view coord
uniform vec3 lightColor;	// use for ip
uniform vec3 ambientColor;	// use for ia

// Shared variables
varying vec4 v_viewPosition;
varying vec4 v_normal;
varying vec4 l;

void main() {

	vec4 ambient; // I_a * kA
	vec4 diffuse; // I_l * kd * (n dot l)
	vec4 specular; // i_l * kS * (v dot r)^(shininess)

    // Use GLSL reflect (l dot n) to get r for specular computation
    vec4 r = reflect(l,v_normal);

	// Compute ambient, diffuse and specular 
	ambient = kAmbient*vec4(ambientColor, 1.0);
	diffuse = kDiffuse*dot(v_normal, l)*vec4(lightColor, 1.0);
	float s = pow(abs(dot(r,v_viewPosition)), shininess); // compute (v dot r)^(shininess)
    vec4 sp = vec4(s, s, s, 1.0);
    specular = kSpecular*sp*vec4(lightColor, 1.0);

	// Compute Phong Illumination equation
	gl_FragColor = ambient + diffuse + specular;
}