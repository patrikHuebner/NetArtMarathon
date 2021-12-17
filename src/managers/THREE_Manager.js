import * as THREE from 'three';
import { useStore } from "vuex";
import Stats from "@/utils/Stats";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnimationFrame from "@/utils/AnimationFrame.js";
// import Sketch from '@/THREE/Sketch.js';
// import PostProcessing from '@/THREE/PostProcessing.js';

export default class THREE_Manager {
    constructor(args) {
        // VueX
        this.store = useStore();

        // Arguments & global variables
        this.parentContainer = document.getElementById(args.parentContainer);
        this.capFrameRate = (typeof args.capFrameRate !== 'undefined') ? args.capFrameRate : false;
        this.targetFrameRate = (typeof args.targetFrameRate !== 'undefined') ? args.targetFrameRate : 60;
        this.showStats = (typeof args.showStats !== 'undefined') ? args.showStats : true;
        this.enableControls = (typeof args.enableControls !== 'undefined') ? args.enableControls : true;
        this.backgroundColor = (typeof args.backgroundColor !== 'undefined') ? args.backgroundColor : '#ff0000';
        this.cameraPosition = (typeof args.cameraPosition !== 'undefined') ? args.cameraPosition : { x: 25, y: 10, z: 25, fov: 40 };
        this.cameraRotation = (typeof args.cameraRotation !== 'undefined') ? args.cameraRotation : { x: 0, y: 0, z: 0 };
        this.cameraTarget = (typeof args.cameraTarget !== 'undefined') ? args.cameraTarget : { x: 0, y: 0, z: 0 };
        this.keepControlsAboveGround = (typeof args.keepControlsAboveGround !== 'undefined') ? args.keepControlsAboveGround : true;

        //
        this.animationHandler = null;
        this.animationFrame = null;
        this.clock = new THREE.Clock();
        this.start = Date.now();
        this.tabActive = true;

        // Triger THREE initialization
        this.init();
    }




    initSketch(sketch) {
        this.sketch = sketch;
    }


    // INIT ---------------------------------------------------------------------------------------------
    init() {
        // Check if tab is active or passive
        this.tabVisibilityEvent();

        // Init THREE.js
        this.init_renderer();
        this.init_scene();
        this.init_camera();
        this.init_controls();
        this.init_stats();
        // if (this.store.state.three.usePostProcessing) {
        //     this.postProcessing = new PostProcessing({ threeManager: this });
        // }

        // Start the animation loop
        this.startAnimationLoop();

        // Add resize event
        window.addEventListener('resize', this.resize.bind(this));
    }



    // RENDERER ---------------------------------------------------------------------------------------------
    init_renderer() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.store.state.three.antialiasing,
            powerPreference: 'high-performance'
        });
        this.renderer.setClearColor(new THREE.Color(this.backgroundColor));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = 'threeWebGL';

        // this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = 1; // 4
        this.renderer.toneMappingExposure = 1;


        // Check and apply shadow settings
        if (this.store.state.three.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // Check and apply retina settings
        if (this.store.state.three.retinaResolution) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.store.state.three.pixelRatio = window.devicePixelRatio;
        } else {
            this.renderer.setPixelRatio(1);
            this.store.state.three.pixelRatio = 1;
        }

        // Attach renderer to DOM
        this.parentContainer.appendChild(this.renderer.domElement);
    }



    // SCENE ---------------------------------------------------------------------------------------------
    init_scene() {
        this.scene = new THREE.Scene();
    }



    // CAMERA ---------------------------------------------------------------------------------------------
    init_camera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
        this.camera.rotation.set(this.cameraRotation.x, this.cameraRotation.y, this.cameraRotation.z);
        this.camera.lookAt(0,0,0);
        this.camera.fov = this.cameraPosition.fov;

        this.camera.updateProjectionMatrix();
    }



    // CONTROLS ---------------------------------------------------------------------------------------------
    init_controls() {
        if (this.enableControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.enablePan = true;
            this.controls.dampingFactor = 0.2;
            this.controls.rotateSpeed = 0.7;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 1000;

            // Prevent controls from going beyond the ground
            if (this.keepControlsAboveGround) {
                this.centerPosition = this.controls.target.clone();
                this.centerPosition.y = 0;
                this.groundPosition = this.camera.position.clone();
                this.groundPosition.y = 0;
                this.d = (this.centerPosition.distanceTo(this.groundPosition));
                this.origin = new THREE.Vector2(this.controls.target.y + 2, 0);
                this.remote = new THREE.Vector2(0, this.d); // replace 0 with raycasted ground altitude
                this.angleRadians = Math.atan2(this.remote.y - this.origin.y, this.remote.x - this.origin.x);
                this.controls.maxPolarAngle = this.angleRadians;
            }

            this.controls.target.x = this.cameraTarget.x;
            this.controls.target.y = this.cameraTarget.y;
            this.controls.target.z = this.cameraTarget.z;
            this.controls.update();
        }
    }



    // STATISTICS ---------------------------------------------------------------------------------------------
    init_stats() {
        if (this.showStats) {
            this.stats = new Stats();
            let statsContainer = document.createElement("div");
            statsContainer.setAttribute("id", "Stats-output");
            statsContainer.appendChild(this.stats.dom);
            this.stats.dom.style.cssText = 'position:absolute;top:20px;right:20px;';
            document.body.appendChild(statsContainer);
        }
    }



    // RESIZE ---------------------------------------------------------------------------------------------
    resize() {
        if (!this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // if (this.postProcessing) {
        //     this.postProcessing.resize();
        // }
    }



    // ANIMATION LOOP: START ---------------------------------------------------------------------------------------------
    startAnimationLoop() {
        if (this.capFrameRate) {
            let animFrame = new AnimationFrame(this.targetFrameRate, this.animate, this);
            animFrame.start();
        } else {
            this.animationHandler = this.animate.bind(this);
            this.animate();
        }
    }
    // ANIMATION LOOP: STOP ---------------------------------------------------------------------------------------------
    stopAnimationLoop() {
        cancelAnimationFrame(this.animationFrame);
        this.animationHandler = null;
    }



    // ANIMATION HANDLER ---------------------------------------------------------------------------------------------
    animate(delta, reference) {
        if (reference == undefined) {
            this.render();
            this.animationFrame = requestAnimationFrame(this.animationHandler);
        } else {
            reference.render();
        }
    }



    // RENDER LOOP LOGIC ---------------------------------------------------------------------------------------------
    render() {
        this.update();
        this.draw();
    }



    // UPDATE LOGIC ---------------------------------------------------------------------------------------------
    update() {
        // Stats
        if (this.stats != null) this.stats.begin();


        // Controls
        if (this.controls) {
            this.controls.update();
        }

        // Sketch
        if (this.sketch) {
            this.sketch.update();
        }

        // // Composer
        // if (this.postProcessing) {
        //     this.postProcessing.update();
        // }

        // FrameCount
        this.store.dispatch("animation_increaseFrameCount");
    }


    // DRAW LOGIC ---------------------------------------------------------------------------------------------
    draw() {
        // Render
        this.renderer.render(this.scene, this.camera);

        // if (this.store.state.three.usePostProcessing) {
        //     this.postProcessing.composer.render();
        // } else {
        //     this.renderer.render(this.scene, this.camera);
        // }

        // Stats
        if (this.stats != null) this.stats.end();
    }





    // CHECK IF TAB IS ACTIVE  ---------------------------------------------------------------------------------------------
    tabVisibilityEvent() {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                this.tabActive = false;
                // console.log('Page is hidden from user view');
            } else {
                this.tabActive = true;
                // console.log('Page is in user view');
            }
        });
    }




}