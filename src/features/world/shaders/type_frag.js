const typeFragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_seed;
uniform float u_distFactor; 
uniform float u_scroll; 
uniform float u_scrollDistortion;

uniform float u_mouseX;
uniform float u_mouseY;

uniform sampler2D u_wood;
uniform sampler2D u_reflection;
uniform sampler2D u_perlin;

uniform vec2 u_resolution;

varying vec2 v_texcoord;
varying vec3 vPosition;
varying vec3 vColor;

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

//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}







float fbm(vec3 p)
{
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++)
  {
    value += snoise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}



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
  vec4 perlin = texture2D(u_perlin, vec2(uv.x, uv.y));
  float t = u_time;


  ///


  float noise = texture2D(
      u_perlin,
      uv * vec2(1.0, 2.0) + vec2(0.01 * t, t * 0.02)
  ).r;
  
  float swell =
      0.012 * sin(uv.y * 18.0 + t * 0.35) +
      0.001 * sin(uv.y * 37.0 - t * 0.55);

  float ripples =
      0.004 * sin(uv.y * 95.0 + 2. * t * 1.2 + 10. * noise) +
      0.002 * sin(uv.y * 170.0 - t * 1.7);

  float distortion = (swell + ripples) * mix(0.1, 1.2, noise);
  float initDistortion = u_distFactor * distortion;


  ///


  vec2 distortionUV = vec2(uv.x, 0.996 * uv.y) + vec2(
      1.2 * distortion * u_scrollDistortion - initDistortion,
      0.001 * sign(sin(uv.x * 25.0 + t * 0.4)) *
      pow(abs(sin(uv.x * 25.0 + t * 0.8)), 4.0) - distortion - initDistortion
  );

  vec2 initDistortionUV = vec2(uv.x, 0.996 * uv.y) + vec2(
    1.2 * initDistortion * u_scrollDistortion,
    0.001 * sin(uv.x * 25.0 + t * 0.4) * u_scrollDistortion - initDistortion
  );


  ///


  vec4 mainTexture = texture2D(u_wood, initDistortionUV);
  vec4 reflectionTexture = texture2D(u_reflection, distortionUV);

  float reflectionAlpha = reflectionTexture.a * 0.4 * noise;

  float finalAlpha = u_scroll * (reflectionAlpha
      + mainTexture.a * (1.0 - reflectionAlpha));
  
  vec3 finalRGB = (
      reflectionTexture.rgb * reflectionAlpha
      + mainTexture.rgb * mainTexture.a * (1.0 - reflectionAlpha)
  ) / max(finalAlpha, 0.00001);
  

  gl_FragColor = vec4(finalRGB, finalAlpha);
}
`
export default typeFragment
