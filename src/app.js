import * as THREE from "three";
import { Vertex } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";
import gasp from "gsap";

//shaders
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

import landscape from "./assets/1.webp";

export default class sketch {
  constructor(options) {
    this.time = 0;
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scroll = 0;
    this.scrollTarget = 0;
    this.currentScroll = 0;

    this.setupResize();
    this.addObjects();
    this.render();
    this.resize();
    this.scrollEvent();
  }

  scrollEvent() {
    document.addEventListener('mousedown', e => {
      this.scrollTarget = e.wheelDelta.y * 0.3;
    })
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extension: "#extension GL_OES_standard_derivatives: enable",
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },

        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.meshes = [];

    for (let i = 0; i < 10; i++) {
      let mesh = new THREE.Mesh(this.geometry, this.material);
      this.meshes.push({
        mesh,
        index: 1,
      });
      this.scene.add(mesh);
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateMeshes({
    this.meshes.forEach(v => {
      v.mesh.position.x = 1.1*.index
    })
  })

  render() {
    this.time += 0.001;
    this.updateMeshes();
    this.material.uniforms.time.value = this.time;
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new sketch({
  dom: document.getElementById("container"),
});
