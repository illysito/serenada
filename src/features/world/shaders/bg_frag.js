const typeFragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;

uniform sampler2D u_bg;

uniform vec2 u_resolution;

varying vec2 v_texcoord;

float PI = 3.14159265358979323846;

vec2 aspect(vec2 uv, float image_ratio, float canvas_ratio){
  // if canvas is taller than image, stretch downwards
  // if canvas is landscape to the image, stretch across
  if(image_ratio >= canvas_ratio){
    float ratio = canvas_ratio / image_ratio;
    uv.x *= ratio;
    uv.x += (1.0 - ratio) / 2.0; 
  } else {
    float ratio = image_ratio / canvas_ratio;
    uv.y *= ratio;
    uv.y += (1.0 - ratio) / 2.0; 
  }
  return uv;
}

float rand2(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float hash12(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float rand1(float n){return fract(sin(n) * 43758.5453123);}








void main()
{
  vec2 uv = v_texcoord;

  float canvas_ratio = u_resolution.x / u_resolution.y;
  float image_ratio = 1440.0 / 780.0;

  uv = aspect(
    uv,
    image_ratio,
    canvas_ratio
  );

  float random = hash12(0.5 * gl_FragCoord.xy + u_time);
  float t = u_time;

  ///


  vec4 background = texture2D(u_bg, uv);
  // background = vec4(1.0, 0.0, 0.0, 1.0);

  vec3 color = vec3(1.0, 0.9882, 0.9373);

  background.r = color.r + 0.1;
  background.g = color.g + 0.22;
  background.b = color.b - 0.3;
 
  background.rgb *= 0.42;

  gl_FragColor = background + 0.092 * random;
}
`
export default typeFragment
