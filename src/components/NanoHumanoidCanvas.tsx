import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { scrollBridge } from '../utils/scrollBridge'

export function NanoHumanoidCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 6.2)
    camera.updateMatrixWorld()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // --- 2. High-Res Sharp Bokeh Optical Starlight Texture ---
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // Crisp diamond optical stardust / bokeh falloff
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)')
      gradient.addColorStop(0.10, 'rgba(230, 248, 255, 0.90)') // luminous ice white
      gradient.addColorStop(0.24, 'rgba(120, 215, 255, 0.50)') // radiant celestial cyan
      gradient.addColorStop(0.50, 'rgba(40, 130, 235, 0.15)')  // electric sky
      gradient.addColorStop(0.78, 'rgba(15, 45, 140, 0.02)')   // deep midnight indigo
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    const particleTexture = createGlowTexture()

    // --- 3. Colors Palette (Luminous Cybernetic & Starlight) ---
    const cNeonCyan = new THREE.Color(0.28, 0.92, 1.0)
    const cElectricSky = new THREE.Color(0.18, 0.65, 1.0)
    const cDeepCobalt = new THREE.Color(0.12, 0.38, 0.92)

    let pointCloud: THREE.Points | null = null
    let originalPositions: Float32Array | null = null
    let phases: Float32Array | null = null
    let totalPoints = 0
    let headPointsCount = 0

    // --- 4. Load High-Resolution 3D Head Model ---
    const loader = new GLTFLoader()
    loader.load(
      '/models/head.glb',
      (gltf) => {
        let headMesh: THREE.Mesh | null = null
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !headMesh) {
            headMesh = child as THREE.Mesh
          }
        })

        if (!headMesh) return

        const srcGeometry = (headMesh as THREE.Mesh).geometry
        srcGeometry.center()
        srcGeometry.computeVertexNormals()

        const posAttr = srcGeometry.attributes.position
        const normalAttr = srcGeometry.attributes.normal
        const numVertices = posAttr.count

        // Target: Dense Futuristic Nano-Dots with peripheral dissolving starlight field
        const targetHeadDots = 20000
        const ambientDustDots = 2200
        totalPoints = targetHeadDots + ambientDustDots
        headPointsCount = targetHeadDots
        const dustStart = targetHeadDots

        const positions = new Float32Array(totalPoints * 3)
        const normals = new Float32Array(totalPoints * 3)
        originalPositions = new Float32Array(totalPoints * 3)
        const colors = new Float32Array(totalPoints * 3)
        const sizes = new Float32Array(totalPoints)
        phases = new Float32Array(totalPoints)

        // Noema attributes: peripheral dissolving stardust field and individual twinkle sparkle
        const dispersions = new Float32Array(totalPoints)
        const dispersionDirs = new Float32Array(totalPoints * 3)
        const twinklePhases = new Float32Array(totalPoints)
        const twinkleSpeeds = new Float32Array(totalPoints)
        const breakThresholds = new Float32Array(totalPoints)
        const scatterVectors = new Float32Array(totalPoints * 3)

        // Scale factor: 0.52 restores grand proportion and reaches fully down to bottom
        const scale = 0.52

        const indexAttr = srcGeometry.index
        const numTriangles = indexAttr ? Math.floor(indexAttr.count / 3) : 0

        // Generate Humanoid Nano-Dots strictly from Real 3D Anatomical Scan with true surface normals
        for (let i = 0; i < targetHeadDots; i++) {
          const idx = i * 3
          let vx = 0, vy = 0, vz = 0
          let nx = 0, ny = 0, nz = 0

          if (i < numVertices) {
            vx = posAttr.getX(i) * scale
            vy = posAttr.getY(i) * scale
            vz = posAttr.getZ(i) * scale
            if (normalAttr) {
              nx = normalAttr.getX(i)
              ny = normalAttr.getY(i)
              nz = normalAttr.getZ(i)
            }
          } else if (numTriangles > 0 && indexAttr) {
            const t = Math.floor(Math.random() * numTriangles)
            const i0 = indexAttr.getX(t * 3)
            const i1 = indexAttr.getX(t * 3 + 1)
            const i2 = indexAttr.getX(t * 3 + 2)

            const r1 = Math.random()
            const r2 = Math.random()
            const sqrtR1 = Math.sqrt(r1)
            const u = 1 - sqrtR1
            const v = r2 * sqrtR1
            const w = 1 - u - v

            vx = (u * posAttr.getX(i0) + v * posAttr.getX(i1) + w * posAttr.getX(i2)) * scale
            vy = (u * posAttr.getY(i0) + v * posAttr.getY(i1) + w * posAttr.getY(i2)) * scale
            vz = (u * posAttr.getZ(i0) + v * posAttr.getZ(i1) + w * posAttr.getZ(i2)) * scale
            if (normalAttr) {
              nx = u * normalAttr.getX(i0) + v * normalAttr.getX(i1) + w * normalAttr.getX(i2)
              ny = u * normalAttr.getY(i0) + v * normalAttr.getY(i1) + w * normalAttr.getY(i2)
              nz = u * normalAttr.getZ(i0) + v * normalAttr.getZ(i1) + w * normalAttr.getZ(i2)
            }
          } else {
            const vIdx = Math.floor(Math.random() * numVertices)
            vx = posAttr.getX(vIdx) * scale + (Math.random() - 0.5) * 0.015
            vy = posAttr.getY(vIdx) * scale + (Math.random() - 0.5) * 0.015
            vz = posAttr.getZ(vIdx) * scale + (Math.random() - 0.5) * 0.015
            if (normalAttr) {
              nx = normalAttr.getX(vIdx)
              ny = normalAttr.getY(vIdx)
              nz = normalAttr.getZ(vIdx)
            }
          }

          // Normalize normal vector
          const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
          normals[idx] = nx / nLen
          normals[idx + 1] = ny / nLen
          normals[idx + 2] = nz / nLen

          positions[idx] = vx
          positions[idx + 1] = vy
          positions[idx + 2] = vz
          originalPositions[idx] = vx
          originalPositions[idx + 1] = vy
          originalPositions[idx + 2] = vz

          // Anatomical regions
          const isFront = vz > -0.18 && nz > 0.02
          const isFace = vy > -0.3 && vy < 1.3
          const isFaceCenter = isFront && isFace && Math.abs(vx) < 0.28
          const isTorso = vy <= -0.3

          // Refined Anatomical Hierarchy (Fixes nose split lobes, glowing nostrils & crowded cheeks)
          // 1. Nostril Cavity, Inward Walls & Underside: Deep natural shadow (eliminates glowing snout rings!)
          const isNoseUnderside = (vy >= 0.36 && vy <= 0.64) && 
                                  (Math.abs(vx) <= 0.20) && 
                                  (ny < 0.08 || nz < 0.38 || (vz < 1.26 && ny < 0.35));

          // 2. Sleek Nose Centerline (Bridge + Tip): Single continuous starlight ridge down the middle
          const isNoseCenter = !isNoseUnderside && 
                               (vy >= 0.50 && vy <= 0.90) && 
                               (Math.abs(vx) <= 0.032) && 
                               (vz >= 1.15) && 
                               (nz >= 0.35) && 
                               (ny >= -0.05);

          // 3. Nose Flanks & Paranasal Cheeks: Soft, subtle mid-tones (prevents cheek/alar bloat around nose)
          const isNoseFlank = !isNoseUnderside && !isNoseCenter && 
                              (vy >= 0.36 && vy <= 0.82) && 
                              (Math.abs(vx) <= 0.28);

          // 4. Primary Expressive Facial Features (Eyes, Eyebrows, Lips)
          const isEyesAndBrows = (vy >= 0.82 && vy <= 1.25) && (Math.abs(vx) <= 0.34);
          const isLipsAndMouth = (vy >= 0.04 && vy <= 0.34) && (Math.abs(vx) <= 0.22);

          // 5. Forehead & Crown: Rich luminous celestial presence (prevents "polos" look!)
          const isForehead = (vy >= 0.95 && vy <= 1.50) && (Math.abs(vx) <= 0.46);
          const isCrown = vy > 1.50;

          // Base coloring in refined, deep celestial midnight cobalt stardust
          let col = cDeepCobalt.clone()
          let dotSize = 0.048 + Math.random() * 0.020

          if (isNoseUnderside) {
            // Nostril cavity & underside: deep dark shadow, tiny dots (NO glowing snout rings!)
            col.multiplyScalar(0.08)
            dotSize = 0.009 + Math.random() * 0.005
          } else if (isNoseCenter) {
            // Sleek nose bridge and single center tip: clean, elegant, unified cybernetic line
            col.lerp(cElectricSky, 0.70).lerp(cNeonCyan, 0.35)
            dotSize = 0.050 + Math.random() * 0.014
          } else if (isNoseFlank) {
            // Flanks and cheeks beside nose: soft atmospheric half-tone so nose stands out sleekly
            col.lerp(cElectricSky, 0.28)
            dotSize = 0.034 + Math.random() * 0.010
          } else if (isForehead) {
            // Forehead: richly populated with fine starlight particles (signature living mind)
            col.lerp(cElectricSky, 0.58).lerp(cNeonCyan, 0.30)
            dotSize = 0.052 + Math.random() * 0.020
          } else if (isCrown) {
            // Crown: glowing dissolving stardust field
            col.lerp(cElectricSky, 0.52).lerp(cNeonCyan, 0.24)
            dotSize = 0.048 + Math.random() * 0.018
          } else if (isEyesAndBrows || isLipsAndMouth) {
            // Eyes, brow, mouth: crisp fine definition without chunky clumping
            col.lerp(cElectricSky, 0.55).lerp(cNeonCyan, 0.30)
            dotSize = 0.044 + Math.random() * 0.015
          } else if (isTorso) {
            // Torso softly receding into background
            col.lerp(cElectricSky, 0.42)
            dotSize = 0.048 + Math.random() * 0.018
          } else if (isFront) {
            col.lerp(cElectricSky, 0.58)
            dotSize = 0.052 + Math.random() * 0.018
          } else {
            col.lerp(cElectricSky, 0.46)
            dotSize = 0.044 + Math.random() * 0.016
          }

          sizes[i] = dotSize
          colors[idx] = col.r
          colors[idx + 1] = col.g
          colors[idx + 2] = col.b
          phases[i] = Math.random() * Math.PI * 2

          // Dispersion setup: crown (top of head), temples, and outer contours dissolve into starlight
          const isDissolvingCrown = vy > 1.25
          const isOuterEdge = (Math.abs(vx) > 0.52 && vy > 0.8) || (vz < -0.2 && vy > 0.5)
          const isCoreFeatures = vy >= -0.1 && vy <= 1.2 && Math.abs(vx) <= 0.38

          let dispersion = 0.0
          if (!isCoreFeatures && (isDissolvingCrown || isOuterEdge)) {
            if (Math.random() < 0.42) {
              dispersion = Math.random() * 0.85 + 0.15
            }
          }
          dispersions[i] = dispersion

          // Outward drift direction + gentle upward thermal lift
          const dirLen = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1
          const dirX = vx / dirLen + (Math.random() - 0.5) * 0.35
          const dirY = (vy / dirLen) * 0.6 + 0.45 + Math.random() * 0.3
          const dirZ = vz / dirLen + (Math.random() - 0.5) * 0.35
          const normDir = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1
          dispersionDirs[idx] = dirX / normDir
          dispersionDirs[idx + 1] = dirY / normDir
          dispersionDirs[idx + 2] = dirZ / normDir

          twinklePhases[i] = Math.random() * Math.PI * 2
          twinkleSpeeds[i] = 1.2 + Math.random() * 2.8

          // Staggered slow-mo scroll dispersion thresholds ("pelan-pelan kepecah"):
          // Outer crown, temples, chin dissolve first; expressive facial core dissolves last
          if (isCrown || isOuterEdge || isTorso) {
            breakThresholds[i] = 0.05 + Math.random() * 0.25
          } else if (!isCoreFeatures) {
            breakThresholds[i] = 0.28 + Math.random() * 0.35
          } else {
            breakThresholds[i] = 0.58 + Math.random() * 0.35
          }

          // Aerodynamic vortex swirl vector
          const sTheta = Math.random() * Math.PI * 2
          const sRad = 0.6 + Math.random() * 1.5
          scatterVectors[idx] = Math.cos(sTheta) * sRad + (vx > 0 ? 0.35 : -0.35)
          scatterVectors[idx + 1] = Math.random() * 0.6 + 0.2
          scatterVectors[idx + 2] = Math.sin(sTheta) * sRad + 0.35
        }

        // Generate Floating Ambient Stardust (Natural full-screen spread across left & right flanks)
        const cStarlightWhite = new THREE.Color(0.95, 0.98, 1.0)
        for (let i = dustStart; i < totalPoints; i++) {
          const idx = i * 3
          // Spread widely across X to frame the left and right editorial typography
          const x = (Math.random() - 0.5) * 22.0
          const y = (Math.random() - 0.5) * 12.0
          const z = (Math.random() - 0.5) * 3.5

          positions[idx] = x
          positions[idx + 1] = y
          positions[idx + 2] = z
          originalPositions[idx] = x
          originalPositions[idx + 1] = y
          originalPositions[idx + 2] = z

          normals[idx] = 0
          normals[idx + 1] = 1
          normals[idx + 2] = 0

          const r = Math.random()
          let col = cNeonCyan
          if (r < 0.35) {
            col = cStarlightWhite
          } else if (r < 0.72) {
            col = cElectricSky
          } else {
            col = cNeonCyan
          }
          colors[idx] = col.r * 1.05
          colors[idx + 1] = col.g * 1.05
          colors[idx + 2] = col.b * 1.05
          sizes[i] = 0.034 + Math.random() * 0.038
          phases[i] = Math.random() * Math.PI * 2

          dispersions[i] = 0.0
          dispersionDirs[idx] = 0
          dispersionDirs[idx + 1] = 1
          dispersionDirs[idx + 2] = 0
          twinklePhases[i] = Math.random() * Math.PI * 2
          twinkleSpeeds[i] = 1.0 + Math.random() * 2.2

          breakThresholds[i] = 0.0
          scatterVectors[idx] = (Math.random() - 0.5) * 1.5
          scatterVectors[idx + 1] = Math.random() * 0.8
          scatterVectors[idx + 2] = (Math.random() - 0.5) * 1.5
        }

        // Distinguish humanoid dots from ambient dust
        const isHeadAttr = new Float32Array(totalPoints)
        for (let i = 0; i < dustStart; i++) isHeadAttr[i] = 1.0
        for (let i = dustStart; i < totalPoints; i++) isHeadAttr[i] = 0.0

        // --- 5. Geometry & Custom Shader Material ---
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('aIsHead', new THREE.BufferAttribute(isHeadAttr, 1))
        geometry.setAttribute('aDispersion', new THREE.BufferAttribute(dispersions, 1))
        geometry.setAttribute('aDispersionDir', new THREE.BufferAttribute(dispersionDirs, 3))
        geometry.setAttribute('aTwinklePhase', new THREE.BufferAttribute(twinklePhases, 1))
        geometry.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))
        geometry.setAttribute('aBreakThreshold', new THREE.BufferAttribute(breakThresholds, 1))
        geometry.setAttribute('aScatterVec', new THREE.BufferAttribute(scatterVectors, 3))

        const vertexShader = `
          attribute float size;
          attribute float aIsHead;
          attribute vec3 aNormal;
          attribute float aDispersion;
          attribute vec3 aDispersionDir;
          attribute float aTwinklePhase;
          attribute float aTwinkleSpeed;
          attribute float aBreakThreshold;
          attribute vec3 aScatterVec;

          varying vec3 vColor;
          varying float vAlpha;

          uniform float uTime;
          uniform vec3 uLightPos;
          uniform vec3 uLightDir;
          uniform vec2 uSpotParams; // x: cos(innerCone), y: cos(outerCone)
          uniform float uScrollDisperse;

          void main() {
            vec3 pos = position;

            if (aIsHead > 0.5) {
              // 1. Dynamic dissolution / particle dispersion (Noema signature dissolving light)
              if (aDispersion > 0.01) {
                float driftOscillation = sin(uTime * 0.85 + aTwinklePhase) * 0.5 + 0.5;
                float driftAmount = aDispersion * (0.04 + 0.18 * driftOscillation);
                pos += aDispersionDir * driftAmount;
                pos.y += aDispersion * (sin(uTime * 0.5 + aTwinklePhase) * 0.03 + 0.03);
              }

              // Slow-mo Scroll Particle Morph / Dispersion ("pelan-pelan kepecah")
              if (uScrollDisperse > aBreakThreshold) {
                float disperseT = clamp((uScrollDisperse - aBreakThreshold) / 0.55, 0.0, 1.0);
                float easeT = smoothstep(0.0, 1.0, disperseT);
                
                // Aerodynamic vortex swirl: particles swirl outward & stream downward toward gear section
                float vortexAngle = easeT * 3.6 + aTwinklePhase;
                float cV = cos(vortexAngle);
                float sV = sin(vortexAngle);
                vec2 swirledXZ = vec2(pos.x * cV - pos.z * sV, pos.x * sV + pos.z * cV);
                
                pos.x = mix(pos.x, swirledXZ.x + aScatterVec.x * 3.6, easeT);
                pos.z = mix(pos.z, swirledXZ.y + aScatterVec.z * 2.8, easeT);
                pos.y -= easeT * (3.8 + aScatterVec.y * 2.2); // Downward celestial stream
              }

              // 2. Base calm cybernetic breathing wave
              float normY = clamp((pos.y + 2.1) / 4.2, 0.0, 1.0);
              float wavePhase = normY * 3.2 - uTime * 0.85;
              float breath = smoothstep(0.15, 0.85, sin(wavePhase) * 0.5 + 0.5);
              vec3 cBreath = vec3(0.15, 0.65, 0.95);
              vec3 baseColor = mix(color, cBreath, breath * 0.25) * (0.85 + breath * 0.20);

              // 3. World Space Transform for Exact 3D Cinematic Shading
              vec4 worldPos4 = modelMatrix * vec4(pos, 1.0);
              vec3 worldPos = worldPos4.xyz;
              vec3 worldNormal = normalize(mat3(modelMatrix) * aNormal);

              // Vector from fixed upper-left key-light to vertex in world space
              vec3 toPoint = worldPos - uLightPos;
              float dist = length(toPoint);
              vec3 rayDir = toPoint / max(dist, 0.001);

              // Vector from vertex towards light source
              vec3 lightDir = -rayDir;

              // Wide soft studio spotlight cone
              float spotCos = dot(rayDir, normalize(uLightDir));
              float spotIntensity = smoothstep(uSpotParams.y, uSpotParams.x, spotCos);

              // Directional Lambertian Law (N · L)
              float NdotL = dot(worldNormal, lightDir);
              float diffuse = max(NdotL, 0.0);

              // Soft photographic wrap lighting to soften edge transitions
              float wrap = max((NdotL + 0.22) / 1.22, 0.0);

              // Soft specular highlight (Blinn-Phong)
              vec3 viewDir = normalize(cameraPosition - worldPos);
              vec3 halfVec = normalize(lightDir + viewDir);
              float NdotH = max(dot(worldNormal, halfVec), 0.0);
              float specular = pow(NdotH, 20.0) * diffuse;

              // Physical distance attenuation
              float distDecay = 1.0 / (1.0 + 0.045 * dist + 0.008 * dist * dist);

              // Nostril cavity shadow preservation (prevents hollow nostril glow)
              float nostrilOcclusion = 1.0;
              if (pos.y >= 0.36 && pos.y <= 0.64 && abs(pos.x) <= 0.20 && (aNormal.y < 0.08 || aNormal.z < 0.38 || (pos.z < 1.26 && aNormal.y < 0.35))) {
                nostrilOcclusion = 0.0;
              }

              // Subtle natural particle highlight clustering
              float clusterVar = sin(pos.x * 16.0 + pos.y * 20.0 + pos.z * 14.0) * 0.12 + 0.88;

              // Depth occlusion factor: front surface receives direct light, inner/back volume is subtly attenuated
              float depthFactor = smoothstep(-0.45, 0.35, worldPos.z);

              // Cinematic Key-Light Beam Illumination & Specular Glint
              float beamFactor = spotIntensity * (diffuse * 0.85 + wrap * 0.15) * distDecay * nostrilOcclusion * (0.80 + 0.20 * depthFactor);
              float coreHotspot = pow(spotIntensity, 2.2) * (pow(diffuse, 2.0) * 0.65 + specular * 0.85) * distDecay * nostrilOcclusion * clusterVar * depthFactor;

              // Secondary Fill Light (Soft atmospheric rim & bounce from Right so the right head is visible and refined)
              vec3 fillDir = normalize(vec3(1.6, 0.4, 1.2));
              float fillNdotL = max(dot(worldNormal, fillDir), 0.0);
              float fillWrap = max((fillNdotL + 0.30) / 1.30, 0.0);
              vec3 fillBounce = vec3(0.14, 0.44, 0.82) * (fillWrap * 0.50 + 0.25);

              // 4. Starlight Colors
              // Balanced ambient floor: right side particles are clearly visible, but elegant and never bold/blown out
              vec3 ambientColor = baseColor * 0.58 + fillBounce;
              vec3 cLuminousCyan = vec3(0.26, 0.86, 0.98); // Refined cyan beam aura
              vec3 cDiamondWhite = vec3(1.15, 1.45, 1.80); // Crisp diamond glint core

              vec3 litColor = ambientColor 
                            + baseColor * (beamFactor * 1.15) 
                            + cLuminousCyan * (beamFactor * 1.30) 
                            + cDiamondWhite * (coreHotspot * 1.35);

              // 5. Delicate per-particle twinkle sparkle + detachment flare
              float twinkle = 0.90 + 0.20 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
              if (uScrollDisperse > aBreakThreshold) {
                float disperseT = clamp((uScrollDisperse - aBreakThreshold) / 0.55, 0.0, 1.0);
                float detachFlare = sin(disperseT * 3.14159) * 2.2;
                litColor = mix(litColor, vec3(1.6, 2.2, 2.8), detachFlare * 0.7);
                twinkle += detachFlare * 0.5;
              }

              vColor = litColor * twinkle;
              
              // Smooth slow-mo alpha dissolve as scroll completes
              float alphaFade = 1.0 - smoothstep(0.80, 0.99, uScrollDisperse);
              vAlpha = alphaFade;

              // 6. Point sizing: crisp, fine, elegant stardust nano-dots (never chunky/bold!)
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              float sizeMultiplier = 0.95 + beamFactor * 0.40 + coreHotspot * 0.45 + breath * 0.06;
              gl_PointSize = size * sizeMultiplier * (390.0 / -mvPosition.z);
              gl_PointSize = clamp(gl_PointSize, 2.4, 7.8);
              gl_Position = projectionMatrix * mvPosition;
            } else {
              // Ambient floating cosmic dust (illuminated as upper-left beam sweeps across space)
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              
              // Dust in key-light beam (calculated in world space)
              vec4 worldDustPos4 = modelMatrix * vec4(pos, 1.0);
              vec3 worldDustPos = worldDustPos4.xyz;
              vec3 toDust = worldDustPos - uLightPos;
              float dustDist = length(toDust);
              vec3 dustRay = toDust / max(dustDist, 0.001);
              float dustSpotCos = dot(dustRay, normalize(uLightDir));
              float dustSpot = smoothstep(uSpotParams.y * 0.85, uSpotParams.x, dustSpotCos);
              float dustDistDecay = 1.0 / (1.0 + 0.045 * dustDist);
              float dustBeam = dustSpot * dustDistDecay;

              float twinkle = 0.76 + 0.24 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
              vec3 dustColor = mix(color * 0.90, vec3(0.96, 0.99, 1.0), dustBeam * 0.60);
              vColor = dustColor * twinkle * (0.95 + dustBeam * 0.85);
              float alphaFade = 1.0 - smoothstep(0.85, 1.0, uScrollDisperse) * 0.4;
              vAlpha = (0.50 + dustBeam * 0.35) * alphaFade;
              gl_PointSize = size * (1.05 + dustBeam * 0.95) * (440.0 / -mvPosition.z);
              gl_PointSize = clamp(gl_PointSize, 2.2, 6.2);
              gl_Position = projectionMatrix * mvPosition;
            }
          }
        `

        const fragmentShader = `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec4 tex = texture2D(pointTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor, vAlpha) * tex;
          }
        `

        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: particleTexture },
            uTime: { value: 0 },
            uLightPos: { value: new THREE.Vector3(-2.60, 2.50, 3.20) },
            uLightDir: { value: new THREE.Vector3(0.57, -0.50, -0.65).normalize() },
            uSpotParams: { value: new THREE.Vector2(Math.cos(30 * (Math.PI / 180)), Math.cos(72 * (Math.PI / 180))) },
            uScrollDisperse: { value: 0 },
          },
          vertexShader,
          fragmentShader,
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        pointCloud = new THREE.Points(geometry, material)
        // Centered initial orientation, positioned so neck and shoulders reach the bottom comfortably
        pointCloud.rotation.y = 0
        pointCloud.rotation.x = 0
        pointCloud.position.set(0, -0.42, 0)
        scene.add(pointCloud)
        ;(window as any).__pointCloud = pointCloud
      },
      undefined,
      (err) => {
        console.error('Error loading head model:', err)
      }
    )

    // --- 6. Mouse Interaction (Head Rotation & Cinematic Parallax) ---
    let targetRotationX = 0
    let targetRotationY = 0
    let currentRotationX = 0
    let currentRotationY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1
      targetRotationY = ndcX * 0.45
      targetRotationX = -ndcY * 0.20
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const ndcX = (touch.clientX / window.innerWidth) * 2 - 1
        const ndcY = -(touch.clientY / window.innerHeight) * 2 + 1
        targetRotationY = ndcX * 0.45
        targetRotationX = -ndcY * 0.20
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // --- 7. Animation Loop ---
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth fluid damping for 3D head rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05
      currentRotationY += (targetRotationY - currentRotationY) * 0.05

      // Fixed Cinematic Key-Light from UPPER-LEFT with subtle living breath
      const AIM_TARGET = new THREE.Vector3(0.10, 0.15, 0.10)
      const lightX = -2.60 + Math.sin(elapsedTime * 0.35) * 0.08
      const lightY = 2.50 + Math.cos(elapsedTime * 0.30) * 0.06
      const lightZ = 3.20 + Math.sin(elapsedTime * 0.25) * 0.06
      const fixedLightPos = new THREE.Vector3(lightX, lightY, lightZ)
      const fixedLightDir = AIM_TARGET.clone().sub(fixedLightPos).normalize()

      // Scroll-driven disperse removed: humanoid stays assembled.
      // (scrollBridge.tick() kept to drive the shared smoothing clock.)
      const scrollState = scrollBridge.tick()
      void scrollState

      // Update shader uniforms in real-time
      if (pointCloud && pointCloud.material) {
        const mat = pointCloud.material as THREE.ShaderMaterial
        mat.uniforms.uTime.value = elapsedTime
        mat.uniforms.uLightPos.value.copy(fixedLightPos)
        mat.uniforms.uLightDir.value.copy(fixedLightDir)
        mat.uniforms.uSpotParams.value.set(
          Math.cos(30 * (Math.PI / 180)), // 30 deg inner cone
          Math.cos(72 * (Math.PI / 180))  // 72 deg outer cone
        )
        mat.uniforms.uScrollDisperse.value = 0
      }

      if (pointCloud) {
        const ambientYaw = Math.sin(elapsedTime * 0.25) * 0.04
        const ambientPitch = Math.cos(elapsedTime * 0.2) * 0.02

        // Symmetrical tracking centered at 0
        pointCloud.rotation.y = currentRotationY + ambientYaw
        pointCloud.rotation.x = currentRotationX + ambientPitch
      }

      // Update drifting dust particles and subtle facial breathing
      if (pointCloud && originalPositions && phases) {
        const posAttr = pointCloud.geometry.attributes.position as THREE.BufferAttribute
        const posArray = posAttr.array as Float32Array

        for (let i = 0; i < totalPoints; i++) {
          const idx = i * 3
          const origX = originalPositions[idx]
          const origY = originalPositions[idx + 1]
          const origZ = originalPositions[idx + 2]
          const phase = phases[i]

          if (i >= headPointsCount) {
            // Ambient dust drifting upwards across the full screen
            const driftY = ((elapsedTime * 0.16 + phase * 2.0) % 12.0) - 6.0
            posArray[idx + 1] = driftY
            posArray[idx] = origX + Math.sin(elapsedTime * 0.25 + phase) * 0.15
            posArray[idx + 2] = origZ + Math.cos(elapsedTime * 0.25 + phase) * 0.15
          } else {
            // Micro breathing pulse on the humanoid nano-dots
            const wave = Math.sin(elapsedTime * 1.5 + phase + origY * 2.0) * 0.008
            posArray[idx] = origX + origX * wave * 0.15
            posArray[idx + 1] = origY + wave
            posArray[idx + 2] = origZ + origZ * wave * 0.15
          }
        }

        posAttr.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate()

    // --- 8. Window Resize ---
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      if (pointCloud) {
        pointCloud.geometry.dispose()
        ;(pointCloud.material as THREE.Material).dispose()
      }
      if (particleTexture) particleTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}
