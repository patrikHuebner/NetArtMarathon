varying vec2 vUv;
uniform vec4 resolution;
uniform float time;
uniform sampler2D uTexture;

void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
}