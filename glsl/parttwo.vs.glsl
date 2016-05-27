varying vec2 vuv;

//varying float noise;


void main() {
    vuv = uv;

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);




}
