// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
uniform sampler2D sphereTexture;
varying vec2 texCoord;


void main() {

	// LOOK UP THE COLOR IN THE TEXTURE

// unknown uniform type error ...

 vec4 texColor = texture2D(sphereTexture, texCoord);


	gl_FragColor = texColor;
}
