import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.onload = () => loadModel();

function loadModel() {
  const loader = new GLTFLoader();
  loader.load('ani.glb',
    (gltf) => {
      setupScene(gltf);
      document.getElementById('avatar-loading').style.display = 'none';
    }, 
    (xhr) => {
      const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
      document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`
      console.log(`Loading model... ${percentCompletion}%`);
    }, 
    (error) => {
      console.log(error);
    }
  );
}

function setupScene(gltf) {
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    const container = document.getElementById('avatar-container');
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    container.appendChild(renderer.domElement);

    // Create the shader material
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            #define rand(z) fract(sin(z)*1352.2342)
            const float pi2 = acos(-1.)*2.;

            mat2 rotate(float a) {
                return mat2(cos(a), -sin(a), sin(a), cos(a));
            }

            vec2 rand2f(vec2 co) {
                vec2 z = vec2(dot(co, vec2(1.1521, 1.4322)), dot(co, vec2(1.2341, 1.3251)));
                return rand(z);
            }

            float voronoiBorder(vec2 x, float seed, float phase) {
                vec2 xi = floor(x);
                vec2 xf = fract(x);
                
                vec2 res = vec2(10.);
                for(int i=-1; i<=1; i++) {
                    for(int j=-1; j<=1; j++) {
                        vec2 b = vec2(i,j);
                        vec2 rv = rand2f(xi+b+seed*1.3412);
                        rv = sin(rv*pi2 + phase)*.5+.5;
                        rv *= .75;
                        vec2 r = b+rv - xf;
                        float d = dot(r,r);
                        
                        if(d<res.x) {
                            res.y = res.x;
                            res.x = d;
                        } else if(d<res.y) {
                            res.y = d;
                        }
                    }
                }
                
                res = sqrt(res);
                return 1.-smoothstep(-.1, .1, res.y-res.x);
            }

            float smoothFloor(float x, float s) {
                return floor(x-.5)+smoothstep(.5-s, .5+s, fract(x-.5));
            }

            varying vec2 vUv;
            uniform float iTime;
            uniform vec2 iResolution;

            void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                vec2 p = (fragCoord*2.-iResolution.xy) / min(iResolution.x, iResolution.y);
                vec3 color = vec3(0);
                
                p *= rotate(iTime*.2);
                float cPos = iTime;
                float id = ceil(cPos);
                
                for(float i=0.; i<20.; i++) {
                    float L = 1.-fract(cPos)+i;
                    float a = atan(.003, L)*500.;
                    float r = rand(id)*pi2;
                    float phase = iTime + r;
                    phase = smoothFloor(phase, .2);
                    vec2 rv = rand2f(vec2(id, id*1.31223)) * 10.;
                    
                    float v1 = voronoiBorder(p/a+rv, id, phase);
                    float v2 = voronoiBorder(p/a*.5+iTime*vec2(cos(r),sin(r)), id, phase);
                    float v = pow(v1*v2, 3.) * 200.;
                    
                    color += (v1*vec3(.9, .4, 0.) + v) * exp(-L*L*0.001);
                    id++;
                }
                
                fragColor = vec4(color, 1.);
            }

            void main() {
                mainImage(gl_FragColor, vUv * iResolution.xy);
            }
        `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, shaderMaterial);

    // Full-screen quad to render the shader as the background
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene.add(plane);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        shaderMaterial.uniforms.iTime.value += 0.05;  // Update time for shader animation
        renderer.render(scene, camera);
    }
    animate();
}
