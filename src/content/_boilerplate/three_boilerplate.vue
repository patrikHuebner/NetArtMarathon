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
        capFrameRate: false,
        enableControls: true,
        showStats: false,
        backgroundColor: "#000000",
        cameraPosition: { x: 25, y: 10, z: 25, fov: 40 },
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

      let sketch = new Sketch({ threeManager: threeManager });
      threeManager.initSketch(sketch);
    });
  },
};

// THREE.JS ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import * as THREE from "three";
import { radians } from "@/utils/utils.js";

class Sketch {
  constructor(args) {
    // ThreeManager
    this.three = args.threeManager;

    // Init
    this.init();
  }

  // INIT ---------------------------------------------------------------------------------------------

  init() {
    this.addLights();
    this.demoCube = this.createCube();
  }

  update() {
    if (this.demoCube) {
      this.demoCube.rotation.y += this.three.clock.getDelta();
    }
  }

  resize() {}

  // METHODS ---------------------------------------------------------------------------------------------

  createCube() {
    // geometry
    let geometry = new THREE.BoxGeometry(3, 3, 3);

    // material
    let material = new THREE.MeshNormalMaterial({});

    // create mesh and add to scene
    let cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = radians(45);
    cube.rotation.y = radians(45);
    this.three.scene.add(cube);

    return cube;
  }

  addLights() {
    // Directional Light 1
    this.directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight1.position.set(10, 10, 5);
    this.three.scene.add(this.directionalLight1);

    // Directional Light 2
    this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight2.position.set(-10, -10, -5);
    this.three.scene.add(this.directionalLight2);
  }
}
</script>









<style lang="scss">
@import "../../assets/styles/theming.scss";
</style>
