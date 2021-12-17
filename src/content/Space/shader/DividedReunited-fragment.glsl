uniform float time;
varying vec2 vUv;
uniform vec4 resolution;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;

void main(){
    
    vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
    
    vec4 color=texture2D(uTexture,newUV);
    vec4 offset=texture2D(uDataTexture,vUv);
    
    // gl_FragColor=color;
    // gl_FragColor=offset;
    gl_FragColor=texture2D(uTexture,newUV-.02*offset.rg);
    
}