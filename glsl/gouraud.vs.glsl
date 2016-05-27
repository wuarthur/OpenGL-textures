varying vec4 V_Color;

// Constants
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// Light properties
uniform vec3 lightDirection; // use to find l , convert to view coord
uniform vec3 lightColor;	// use for ip
uniform vec3 ambientColor;	// use for ia


void main() {
	// Compute Gouraud Shading
	// we have to convert everything into view coordinate system (use modelViewMatrix)
	// we are given normal --> convert to n
	// we are given lightDirection --> convert to l
	// [we are given cameraPosition (useful for Blinn-Phong)]
	// we need to calculate perfect reflection r of lightDirection (Use Snell's law), use reflect
	// to get v, modelViewMatrix*position


	// General formula of Phong: I = ka*Ia + Ip*[kd*(dot(n,l)) + ks*(dot(r,v))]
	// 							 I = Ambient + Diffuse + Specular
	// Blinn-Phong: I = ka*Ia + Ip*[kd*(dot(n,l)) + ks*(dot(h,v))^(1/r)]
	//												where h = (l+v)/2

	vec4 ambient; // I_a * kA
	vec4 diffuse; // I_l * kd * (n dot l)
	vec4 specular; // i_l * kS * (v dot r)^(shininess)

	// Normalize all vectors used in lighting calculations 
	// and ensure all in view coordinate system
    vec4 l =  normalize(viewMatrix* vec4(lightDirection, 0.0));
	vec4 n = vec4(normalize(normalMatrix*normal), 0.0);
	vec4 v = modelViewMatrix*vec4(position, 0.0); // set in view coordinate system

	// Use GLSL reflect function to obtain r value
	// vec4 r = reflect(viewMatrix*vec4(lightDirection, 0.0),vec4(normalMatrix*normal, 0.0));
	vec4 r = reflect(l,n);

	ambient = kAmbient*vec4(ambientColor, 1.0);
	diffuse = kDiffuse*dot(n, l)*vec4(lightColor, 1.0);
	float s = pow(abs(dot(r,v)), shininess); // compute (v dot r)^(shininess)
	vec4 sp = vec4(s, s, s, 1.0);
	specular = kSpecular*sp*vec4(lightColor, 1.0);

	// Compute Phong illumination equation
	 V_Color = ambient + diffuse + specular;


	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}