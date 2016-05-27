uniform sampler2D furTexture;
varying vec2 vuv;
//varying float noise;

void main() {

vec4 texColor = texture2D(furTexture, vuv);

gl_FragColor = texColor;

//////////////////////





}