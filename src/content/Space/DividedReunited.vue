<template>
  <ProjectHeader />

  <div id="WEBGL"></div>

  <ProjectFooter />
</template>



<script>
// VUE ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import THREE_Manager from "@/managers/THREE_Manager.js";
import { onMounted, watch } from "@vue/runtime-dom";
import { useStore } from "vuex";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      let threeManager = new THREE_Manager({
        parentContainer: "WEBGL",
        fullScreenCamera: true,
        capFrameRate: false,
        enableControls: false,
        showStats: false,
        backgroundColor: "#000000",
        cameraPosition: { x: 0, y: 0, z: 1, fov: 70 },
        cameraRotation: { x: 0, y: 0, z: 0 },
        cameraTarget: { x: 0, y: 0, z: 0 },
        keepControlsAboveGround: false,
      });

      watch(
        () => store.getters.themeChange,
        function () {
          if (threeManager) {
            if (store.state.theme.mode == "dark") {
              threeManager.setBackground("#000000");
            }
            if (store.state.theme.mode == "light") {
              threeManager.setBackground("#ffffff");
            }
          }
        }
      );

      let sketch = new Sketch({ threeManager: threeManager, store: store });
      threeManager.initSketch(sketch);
    });
  },
};

// THREE.JS ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import * as THREE from "three";
const glsl = require("glslify");

class Sketch {
  constructor(args) {
    // ThreeManager
    this.three = args.threeManager;
    this.store = args.store;
    this.imageAspect = 0.1;

    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    // Init
    this.init();
  }

  // INIT ---------------------------------------------------------------------------------------------

  init() {
    this.addPlane();
    this.resize();
    this.initMouseEvents();

    setInterval(() => {
      this.newVariant();
    }, 20000);
  }

  update() {
    if (this.dataTexture) {
      this.updateDataTexture();
    }
    // if (this.material) {
    //   this.material.uniforms.time.value += this.three.clock.getDelta();
    // }
  }

  resize() {
    this.width = this.three.renderer.domElement.width;
    this.height = this.three.renderer.domElement.height;
    this.fitPlaneToWindow();
  }

  // METHODS ---------------------------------------------------------------------------------------------

  newVariant() {
    let variants = [8,16,32,64,128,256];
    let newVariant = variants[Math.floor(Math.random()*variants.length)];

    let that = this;
    let rnd = Math.floor(Math.random()*7)
    let nT = new THREE.TextureLoader().load(
      "/assets/abstractGeometry"+rnd+".jpg",

      // Calculate aspect ratio of image
      function (texture) {
        let data = that.dataTexture.image.data;
        for (let i = 0; i < data.length; i += 3) {
          let r = Math.random()*255;
          data[i] = r;
          data[i + 1] = r;
          data[i + 2] = r;
        }

        that.imageAspect =
          texture.image.naturalWidth / texture.image.naturalHeight;
        that.fitPlaneToWindow();

        that.material.uniforms.uTexture.value = texture;
        that.material.needsUpdate = true;
      }
    );
  }

  initMouseEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x =
        (e.clientX / this.width) * this.store.state.three.pixelRatio;
      this.mouse.y =
        (e.clientY / this.height) * this.store.state.three.pixelRatio;

      this.mouse.vX = this.mouse.x - this.mouse.prevX;
      this.mouse.vY = this.mouse.y - this.mouse.prevY;

      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
    });
  }

  // ---------------------------------------------------------------------------------------------
  addPlane() {
    let that = this;

    // Create data texture (create a buffer with color data)
    // ---------------------------------------------------------------------------------------------
    this.gridSize = 128;
    const width = this.gridSize;
    const height = this.gridSize;

    const size = width * height;
    const data = new Float32Array(3 * size);

    for (let i = 0; i < size; i++) {
      let r = Math.random() * 255;
      const stride = i * 3; // index of array item

      data[stride] = r;
      data[stride + 1] = r;
      data[stride + 2] = r;
    }
    // used the buffer to create a DataTexture
    this.dataTexture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBFormat,
      THREE.FloatType
    );
    this.dataTexture.magFilter = this.dataTexture.minFilter =
      THREE.NearestFilter;

    // Create shader material
    // ---------------------------------------------------------------------------------------------
    let rnd = Math.floor(Math.random()*7)
    console.log(rnd)
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#etension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uDataTexture: { value: this.dataTexture },
        uTexture: {
          value: new THREE.TextureLoader().load(
            "/assets/abstractGeometry"+rnd+".jpg",

            // Calculate aspect ratio of image
            function (texture) {
              that.imageAspect =
                texture.image.naturalWidth / texture.image.naturalHeight;
              that.fitPlaneToWindow();
            }
          ),
        },
      },
      vertexShader: glsl(require("./shader/DividedReunited-vertex.glsl").default),
      fragmentShader: glsl(require("./shader/DividedReunited-fragment.glsl").default),
    });

    // Create Geometry and Mesh
    // ---------------------------------------------------------------------------------------------
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.three.scene.add(this.plane);
  }

  // ---------------------------------------------------------------------------------------------
  fitPlaneToWindow() {
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.material.needsUpdate = true;
  }

  // ---------------------------------------------------------------------------------------------
  updateDataTexture() {
    let data = this.dataTexture.image.data;
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= 0.99;
      data[i + 1] *= 0.99;
    }

    // Convert to 0-32 scale
    let gridMouse = {
      x: this.gridSize * this.mouse.x,
      y: this.gridSize * (1 - this.mouse.y),
    };
    //let maxDist = 32;
    let maxDist = this.gridSize / 6;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let distance = (gridMouse.x - i) ** 2 + (gridMouse.y - j) ** 2;
        let maxDistSq = maxDist ** 2;

        if (distance < maxDistSq) {
          let index = 3 * (i + this.gridSize * j);
          let power = maxDist / Math.sqrt(distance); // power of mouse

          let factor = 100;

          data[index] += factor * this.mouse.vX * power;
          data[index + 1] -= factor * this.mouse.vY * power;

          // data[index] += 100 * this.mouse.vX * power;
          // data[index + 1] -= 100 * this.mouse.vY * power;
        }
      }
    }

    this.mouse.vX *= 0.95;
    this.mouse.vY *= 0.95;

    this.dataTexture.needsUpdate = true;
  }
}
</script>









<style lang="scss">
@import "../../assets/styles/theming.scss";

#threeWebGL {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
