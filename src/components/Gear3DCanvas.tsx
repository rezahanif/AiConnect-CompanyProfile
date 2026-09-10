import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { scrollBridge } from '../utils/scrollBridge'

interface GearConfig {
  teeth: number
  pitchRadius: number
  depth: number
  holeRadius: number
  spokes: number
  targetPoints: number
}

// Crisp Diamond Optical Starlight / Bokeh Texture (identical to Hero section)
function createParticleTexture(): THREE.CanvasTexture | null {
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

// Generates an authentic 3D volumetric surface-sampled point cloud from true CAD gear geometry
// Identical in technique to NanoHumanoidCanvas.tsx (barycentric triangle area sampling)
function createGearPointCloudGeometry(config: GearConfig): THREE.BufferGeometry {
  const { teeth, pitchRadius, depth, holeRadius, spokes, targetPoints } = config

  // 1. Construct 2D mathematical involute gear cross-section profile
  const shape = new THREE.Shape()
  const moduleVal = (2 * pitchRadius) / teeth
  const addendum = 0.78 * moduleVal
  const dedendum = 0.92 * moduleVal
  const rOuter = pitchRadius + addendum
  const rRoot = pitchRadius - dedendum
  const dTheta = (Math.PI * 2) / teeth

  // Involute tooth perimeter
  for (let i = 0; i < teeth; i++) {
    const angleBase = i * dTheta
    const a0 = angleBase
    const a1 = angleBase + dTheta * 0.22
    const a2 = angleBase + dTheta * 0.36
    const a3 = angleBase + dTheta * 0.64
    const a4 = angleBase + dTheta * 0.78
    const a5 = angleBase + dTheta

    if (i === 0) {
      shape.moveTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot)
    } else {
      shape.lineTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot)
    }
    shape.lineTo(Math.cos(a1) * rRoot, Math.sin(a1) * rRoot)
    shape.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter)
    shape.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter)
    shape.lineTo(Math.cos(a4) * rRoot, Math.sin(a4) * rRoot)
    shape.lineTo(Math.cos(a5) * rRoot, Math.sin(a5) * rRoot)
  }
  shape.closePath()

  // Center axle bore
  const holePath = new THREE.Path()
  holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true)
  shape.holes.push(holePath)

  // Spoke cutouts (lightening pockets)
  if (spokes > 0) {
    const rSpokeInner = holeRadius + 0.20
    const rSpokeOuter = rRoot - 0.22
    if (rSpokeOuter - rSpokeInner > 0.30) {
      const dSpoke = (Math.PI * 2) / spokes
      const spokeGap = dSpoke * 0.24
      const holeAngleSpan = dSpoke - spokeGap

      for (let s = 0; s < spokes; s++) {
        const startA = s * dSpoke + spokeGap * 0.5
        const endA = startA + holeAngleSpan
        const spokeHole = new THREE.Path()

        spokeHole.moveTo(Math.cos(startA) * rSpokeInner, Math.sin(startA) * rSpokeInner)
        spokeHole.absarc(0, 0, rSpokeInner, startA, endA, false)
        spokeHole.lineTo(Math.cos(endA) * rSpokeOuter, Math.sin(endA) * rSpokeOuter)
        spokeHole.absarc(0, 0, rSpokeOuter, endA, startA, true)
        spokeHole.closePath()

        shape.holes.push(spokeHole)
      }
    }
  }

  // 2. Extrude to true 3D solid geometry with smooth beveled chamfers
  const extrudeGeom = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
  })
  extrudeGeom.center()
  extrudeGeom.computeVertexNormals()

  const srcPosAttr = extrudeGeom.attributes.position
  const srcNormAttr = extrudeGeom.attributes.normal
  const numVertices = srcPosAttr.count
  const numTriangles = Math.floor(numVertices / 3)

  // 3. Area-weighted sampling distribution (ensures uniform stochastic particle density across all 3D faces)
  const triAreas = new Float64Array(numTriangles)
  let totalArea = 0
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3()
  const cb = new THREE.Vector3(), ab = new THREE.Vector3()

  for (let i = 0; i < numTriangles; i++) {
    const idx0 = i * 3
    vA.fromBufferAttribute(srcPosAttr, idx0)
    vB.fromBufferAttribute(srcPosAttr, idx0 + 1)
    vC.fromBufferAttribute(srcPosAttr, idx0 + 2)

    cb.subVectors(vC, vB)
    ab.subVectors(vA, vB)
    cb.cross(ab)
    const area = cb.length() * 0.5
    triAreas[i] = area
    totalArea += area
  }

  const cumAreas = new Float64Array(numTriangles)
  let curArea = 0
  for (let i = 0; i < numTriangles; i++) {
    curArea += triAreas[i] / totalArea
    cumAreas[i] = curArea
  }

  const pickTriangle = (rand: number): number => {
    let low = 0, high = numTriangles - 1
    while (low < high) {
      const mid = (low + high) >> 1
      if (cumAreas[mid] < rand) low = mid + 1
      else high = mid
    }
    return low
  }

  // 4. Sample Surface Points + Internal Volume + Peripheral Dissolving Stardust
  const positions = new Float32Array(targetPoints * 3)
  const normals = new Float32Array(targetPoints * 3)
  const colors = new Float32Array(targetPoints * 3)
  const sizes = new Float32Array(targetPoints)
  const stresses = new Float32Array(targetPoints)
  const drifts = new Float32Array(targetPoints * 3)
  const dispersions = new Float32Array(targetPoints)
  const dispersionDirs = new Float32Array(targetPoints * 3)
  const twinklePhases = new Float32Array(targetPoints)
  const twinkleSpeeds = new Float32Array(targetPoints)
  const phases = new Float32Array(targetPoints)

  // Signature Hero Palettes (exact match to NanoHumanoidCanvas.tsx with +20% visibility)
  const cNeonCyan = new THREE.Color(0.32, 0.95, 1.0)
  const cElectricSky = new THREE.Color(0.22, 0.72, 1.0)
  const cDeepCobalt = new THREE.Color(0.16, 0.44, 0.96)
  const cLuminousIce = new THREE.Color(0.92, 0.98, 1.0)

  const nA = new THREE.Vector3(), nB = new THREE.Vector3(), nC = new THREE.Vector3()

  for (let i = 0; i < targetPoints; i++) {
    const idx = i * 3

    const t = pickTriangle(Math.random())
    const i0 = t * 3
    const i1 = t * 3 + 1
    const i2 = t * 3 + 2

    vA.fromBufferAttribute(srcPosAttr, i0)
    vB.fromBufferAttribute(srcPosAttr, i1)
    vC.fromBufferAttribute(srcPosAttr, i2)

    nA.fromBufferAttribute(srcNormAttr, i0)
    nB.fromBufferAttribute(srcNormAttr, i1)
    nC.fromBufferAttribute(srcNormAttr, i2)

    const r1 = Math.random()
    const r2 = Math.random()
    const sqrtR1 = Math.sqrt(r1)
    const u = 1 - sqrtR1
    const v = r2 * sqrtR1
    const w = 1 - u - v

    let px = u * vA.x + v * vB.x + w * vC.x + (Math.random() - 0.5) * 0.012
    let py = u * vA.y + v * vB.y + w * vC.y + (Math.random() - 0.5) * 0.012
    let pz = u * vA.z + v * vB.z + w * vC.z + (Math.random() - 0.5) * 0.010

    let nx = u * nA.x + v * nB.x + w * nC.x
    let ny = u * nA.y + v * nB.y + w * nC.y
    let nz = u * nA.z + v * nB.z + w * nC.z

    // Subtle internal volume stardust (18% of points pushed slightly inside)
    if (Math.random() < 0.18) {
      pz += (Math.random() - 0.5) * depth * 0.75
    }

    const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
    nx /= nLen
    ny /= nLen
    nz /= nLen

    positions[idx] = px
    positions[idx + 1] = py
    positions[idx + 2] = pz

    normals[idx] = nx
    normals[idx + 1] = ny
    normals[idx + 2] = nz

    // Base coloring: celestial midnight cobalt, electric sky, and radiant cyan
    const r = Math.random()
    let col = cDeepCobalt.clone()
    let dotSize = 0.052 + Math.random() * 0.020

    const rad = Math.sqrt(px * px + py * py)
    const isToothTip = rad > (rOuter - 0.16)
    const isRoot = rad >= (rRoot - 0.12) && rad <= (rRoot + 0.15)

    if (isToothTip) {
      col.lerp(cElectricSky, 0.75).lerp(cNeonCyan, 0.45)
      dotSize = 0.056 + Math.random() * 0.018
    } else if (isRoot) {
      col.lerp(cElectricSky, 0.60).lerp(cNeonCyan, 0.30)
      dotSize = 0.050 + Math.random() * 0.016
    } else {
      col.lerp(cElectricSky, 0.55).lerp(cNeonCyan, 0.25)
    }

    if (Math.random() < 0.16) {
      col = cLuminousIce.clone()
      dotSize = 0.058 + Math.random() * 0.018
    }

    colors[idx] = col.r
    colors[idx + 1] = col.g
    colors[idx + 2] = col.b

    sizes[i] = dotSize
    phases[i] = Math.random()

    // Stress valuation for FEA simulation
    let sVal = 0.15
    if (isRoot) {
      sVal = 0.78 + Math.random() * 0.20
    } else if (isToothTip) {
      sVal = 0.55 + Math.random() * 0.25
    } else if (rad > holeRadius + 0.25 && rad < rRoot - 0.25) {
      sVal = 0.28 + Math.random() * 0.20
    }
    stresses[i] = sVal

    // Drift vector for dissolution (Phase 01)
    const angle = Math.atan2(py, px)
    const driftDist = 1.8 + Math.random() * 2.8
    const dAngle = angle + (Math.random() - 0.5) * 1.1
    drifts[idx] = Math.cos(dAngle) * driftDist
    drifts[idx + 1] = Math.sin(dAngle) * driftDist + (Math.random() - 0.3) * 1.2
    drifts[idx + 2] = (Math.random() - 0.5) * 1.8

    // Peripheral dissolving stardust field (Hero crown dissolution signature)
    if (isToothTip && Math.random() < 0.45) {
      const disp = (rad - (rOuter - 0.16)) * 4.0 + Math.random() * 0.4
      dispersions[i] = disp
      const dRad = Math.sqrt(px * px + py * py) || 1
      dispersionDirs[idx] = (px / dRad) + (Math.random() - 0.5) * 0.3
      dispersionDirs[idx + 1] = (py / dRad) + (Math.random() - 0.5) * 0.3
      dispersionDirs[idx + 2] = (Math.random() - 0.5) * 0.5
    } else {
      dispersions[i] = 0.0
      dispersionDirs[idx] = 0
      dispersionDirs[idx + 1] = 0
      dispersionDirs[idx + 2] = 0
    }

    twinklePhases[i] = Math.random() * Math.PI * 2
    twinkleSpeeds[i] = 1.2 + Math.random() * 2.4
  }

  extrudeGeom.dispose()

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3))
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geom.setAttribute('aStress', new THREE.BufferAttribute(stresses, 1))
  geom.setAttribute('aDrift', new THREE.BufferAttribute(drifts, 3))
  geom.setAttribute('aDispersion', new THREE.BufferAttribute(dispersions, 1))
  geom.setAttribute('aDispersionDir', new THREE.BufferAttribute(dispersionDirs, 3))
  geom.setAttribute('aTwinklePhase', new THREE.BufferAttribute(twinklePhases, 1))
  geom.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))
  geom.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

  return geom
}

// Generate Floating Ambient Cosmic Stardust (identical to Hero section)
function createAmbientStardustGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const twinklePhases = new Float32Array(count)
  const twinkleSpeeds = new Float32Array(count)

  const cNeonCyan = new THREE.Color(0.28, 0.92, 1.0)
  const cElectricSky = new THREE.Color(0.18, 0.65, 1.0)
  const cStarlightWhite = new THREE.Color(0.95, 0.98, 1.0)

  for (let i = 0; i < count; i++) {
    const idx = i * 3
    positions[idx] = (Math.random() - 0.5) * 16.0
    positions[idx + 1] = (Math.random() - 0.5) * 10.0
    positions[idx + 2] = (Math.random() - 0.5) * 3.5

    const r = Math.random()
    let col = cNeonCyan
    if (r < 0.35) col = cStarlightWhite
    else if (r < 0.72) col = cElectricSky

    colors[idx] = col.r * 0.95
    colors[idx + 1] = col.g * 0.95
    colors[idx + 2] = col.b * 0.95

    sizes[i] = 0.028 + Math.random() * 0.030
    twinklePhases[i] = Math.random() * Math.PI * 2
    twinkleSpeeds[i] = 1.0 + Math.random() * 2.2
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geom.setAttribute('aTwinklePhase', new THREE.BufferAttribute(twinklePhases, 1))
  geom.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))
  return geom
}

// Custom Shader for 3D Particle Gears (Exact Hero Lighting & Shading Pipeline)
const gearVertexShader = `
  attribute vec3 aNormal;
  attribute float size;
  attribute float aStress;
  attribute vec3 aDrift;
  attribute float aDispersion;
  attribute vec3 aDispersionDir;
  attribute float aTwinklePhase;
  attribute float aTwinkleSpeed;
  attribute float aPhase;

  uniform float uTime;
  uniform vec3 uLightPos;
  uniform vec3 uLightDir;
  uniform vec2 uSpotParams; // x: cos(innerCone), y: cos(outerCone)
  uniform float uStress;
  uniform float uGather; // 0.0: dispersed ambient floating orbs, 1.0: solid CAD gear
  uniform float uDissolve; // 0.0: normal, 1.0: slow-mo melted away into cosmos
  uniform float uOpacity;
  uniform float uAssemble;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // 1. Peripheral Dissolving Stardust Drift (Signature Hero dissolving light)
    if (aDispersion > 0.01) {
      float driftOscillation = sin(uTime * 0.85 + aTwinklePhase) * 0.5 + 0.5;
      float driftAmount = aDispersion * (0.04 + 0.18 * driftOscillation);
      pos += aDispersionDir * driftAmount;
      pos.z += aDispersion * (sin(uTime * 0.5 + aTwinklePhase) * 0.03);
    }

    // 2. Scroll-in crystallization / emergence
    float localAssemble = clamp((uAssemble - aPhase * 0.30) / 0.70, 0.0, 1.0);
    float assembleEase = smoothstep(0.0, 1.0, localAssemble);

    float scrollSwirl = (1.0 - assembleEase) * 2.8;
    float cSS = cos(scrollSwirl);
    float sSS = sin(scrollSwirl);
    pos.x = pos.x * (0.35 + 0.65 * assembleEase) + (cSS * 0.8 - sSS * 0.3) * (1.0 - assembleEase);
    pos.y += (1.0 - assembleEase) * (3.5 + aPhase * 2.2);
    pos.z += (sSS * 0.8 + cSS * 0.3) * (1.0 - assembleEase);

    // 3. Slow-Motion Smooth Dissolution into Cosmos (Phase 01)
    if (uDissolve > 0.001) {
      float dDist = (0.45 + aPhase * 0.90) * uDissolve;
      pos += aDrift * (0.35 * uDissolve) + vec3(
        cos(aPhase * 6.28318) * dDist,
        sin(aPhase * 6.28318) * dDist + uDissolve * 0.30,
        sin(uTime * 1.5 + aPhase * 3.14) * 0.20 * uDissolve
      );
    }

    // 4. Butter-Smooth 60 FPS Particle Gathering ("pelan-pelan kekumpul jadi gear")
    // When uGather < 0.999, particles smoothly gather from hovering ambient cloud into exact gear teeth
    float gatherVal = clamp(uGather, 0.0, 1.0);
    float localGather = clamp((gatherVal - aPhase * 0.18) / 0.82, 0.0, 1.0);
    float gatherEase = smoothstep(0.0, 1.0, localGather);

    if (gatherVal < 0.999 && uDissolve < 0.001) {
      // Gentle ambient hovering orbit in 3D space, ALWAYS inside camera viewport
      float hoverWave = sin(uTime * 1.4 + aTwinklePhase) * 0.14;
      float swirlAngle = (1.0 - gatherEase) * 2.5 + aPhase * 6.28318;
      float orbRadius = (0.22 + aPhase * 0.42) * (1.0 - gatherEase);
      
      vec3 ambientPos = position + vec3(
        cos(swirlAngle) * orbRadius + aDrift.x * 0.12 * (1.0 - gatherEase),
        sin(swirlAngle) * orbRadius + aDrift.y * 0.12 * (1.0 - gatherEase) + hoverWave,
        sin(uTime * 1.1 + aPhase * 3.14) * 0.20 * (1.0 - gatherEase) + aDrift.z * 0.10 * (1.0 - gatherEase)
      );

      // Smooth continuous 60 FPS hermite motion into gear coordinate
      pos = mix(ambientPos, pos, gatherEase);
    }

    // 4. Cybernetic breathing wave (Hero humanoid signature)
    float normR = length(pos.xy) / 2.6;
    float breath = sin(normR * 3.14 - uTime * 1.1 + aTwinklePhase) * 0.5 + 0.5;
    vec3 cBreath = vec3(0.18, 0.70, 1.0);
    vec3 baseColor = mix(color, cBreath, breath * 0.25) * (0.88 + breath * 0.20);

    // 5. World-Space Directional Spotlight Lighting (Exact match to Hero upper-left beam)
    vec4 worldPos4 = modelMatrix * vec4(pos, 1.0);
    vec3 worldPos = worldPos4.xyz;
    vec3 worldNormal = normalize(mat3(modelMatrix) * aNormal);

    // Vector from fixed upper-left key-light to vertex in world space
    vec3 toPoint = worldPos - uLightPos;
    float dist = length(toPoint);
    vec3 rayDir = toPoint / max(dist, 0.001);
    vec3 lightDir = -rayDir;

    // Wide soft studio spotlight cone
    float spotCos = dot(rayDir, normalize(uLightDir));
    float spotIntensity = smoothstep(uSpotParams.y, uSpotParams.x, spotCos);

    // Directional Lambertian Law (N · L)
    float NdotL = dot(worldNormal, lightDir);
    float diffuse = max(NdotL, 0.0);

    // Soft photographic wrap lighting
    float wrap = max((NdotL + 0.28) / 1.28, 0.0);

    // Soft specular highlight (Blinn-Phong)
    vec3 viewDir = normalize(cameraPosition - worldPos);
    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(dot(worldNormal, halfVec), 0.0);
    float specular = pow(NdotH, 20.0) * diffuse;

    // Physical distance attenuation
    float distDecay = 1.0 / (1.0 + 0.040 * dist + 0.006 * dist * dist);
    float depthFactor = smoothstep(-0.45, 0.35, worldPos.z);

    // Cinematic Key-Light Beam Illumination & Specular Glint
    float beamFactor = spotIntensity * (diffuse * 0.85 + wrap * 0.15) * distDecay * (0.80 + 0.20 * depthFactor);
    float coreHotspot = pow(spotIntensity, 2.0) * (pow(diffuse, 2.0) * 0.65 + specular * 0.85) * distDecay * depthFactor;

    // Secondary Fill Light (Soft atmospheric rim & bounce from Right)
    vec3 fillDir = normalize(vec3(1.6, 0.4, 1.2));
    float fillNdotL = max(dot(worldNormal, fillDir), 0.0);
    float fillWrap = max((fillNdotL + 0.30) / 1.30, 0.0);
    vec3 fillBounce = vec3(0.14, 0.44, 0.82) * (fillWrap * 0.50 + 0.25);

    // 6. von Mises Stress Heatmap Color (Phase 05 simulation)
    float s = aStress;
    vec3 stressColor;
    if (s < 0.25) {
      float t = s / 0.25;
      stressColor = mix(vec3(0.04, 0.40, 1.0), vec3(0.12, 0.90, 1.0), t);
    } else if (s < 0.50) {
      float t = (s - 0.25) / 0.25;
      stressColor = mix(vec3(0.12, 0.90, 1.0), vec3(0.25, 1.0, 0.40), t);
    } else if (s < 0.75) {
      float t = (s - 0.50) / 0.25;
      stressColor = mix(vec3(0.25, 1.0, 0.40), vec3(1.0, 0.90, 0.15), t);
    } else {
      float t = (s - 0.75) / 0.25;
      stressColor = mix(vec3(1.0, 0.90, 0.15), vec3(1.0, 0.14, 0.18), t);
    }

    vec3 activeBase = mix(baseColor, stressColor, uStress);

    // 7. Hero-Grade Starlight Colors (+20% Visibility Boost)
    vec3 ambientColor = mix(activeBase * 0.96 + fillBounce * 1.05, stressColor * 1.45, uStress);
    vec3 cLuminousCyan = vec3(0.32, 0.92, 1.0);
    vec3 cDiamondWhite = vec3(1.30, 1.60, 1.95);

    vec3 litColor = (ambientColor 
                  + activeBase * (beamFactor * 1.45) 
                  + cLuminousCyan * (beamFactor * 1.65) 
                  + cDiamondWhite * (coreHotspot * 1.70)) * 1.20;

    // 8. Delicate per-particle twinkle sparkle
    float twinkle = 0.92 + 0.20 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
    vColor = litColor * twinkle;

    // Alpha calculation: Orbs are ALWAYS visible (never disappear), gently gathering into solid teeth
    float alpha = uOpacity * assembleEase;
    if (uDissolve > 0.001) {
      // Silky slow-motion fade out during dissolution
      alpha *= (1.0 - smoothstep(0.0, 0.96, uDissolve));
    } else if (gatherVal < 0.999) {
      // Floating orbs are luminous and bright (0.78 base opacity), never hidden!
      float gatherAlpha = mix(0.78, 1.0, smoothstep(0.0, 0.85, localGather));
      alpha *= gatherAlpha;

      // Soft luminous aura boost for floating orbs
      vColor += vec3(0.12, 0.48, 0.85) * ((1.0 - gatherEase) * 0.45);

      // Laser crystallization sparkle as orbs lock into gear teeth
      float lockGlow = exp(-pow((localGather - 0.90) * 16.0, 2.0)) * (1.0 - smoothstep(0.96, 1.0, gatherVal));
      vColor = mix(vColor, vec3(1.30, 1.70, 2.10), lockGlow * 0.85);
    }
    vAlpha = alpha;

    // Point sizing: scaled for camera.position.z = 12.6, matching Hero visual weight
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float sizeMultiplier = 0.95 + beamFactor * 0.40 + coreHotspot * 0.45 + breath * 0.06;
    if (gatherVal < 0.999) {
      sizeMultiplier += (1.0 - gatherEase) * 0.32; // Slightly larger glowing orbs while floating
    }
    gl_PointSize = size * sizeMultiplier * (1080.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 3.2, 8.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const gearFragmentShader = `
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.004) discard;
    vec4 tex = texture2D(pointTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor, vAlpha) * tex;
  }
`

// Shader for Ambient Cosmic Stardust
const dustVertexShader = `
  attribute float size;
  attribute float aTwinklePhase;
  attribute float aTwinkleSpeed;

  uniform float uTime;
  uniform vec3 uLightPos;
  uniform vec3 uLightDir;
  uniform vec2 uSpotParams;
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    vec4 worldDustPos4 = modelMatrix * vec4(pos, 1.0);
    vec3 worldDustPos = worldDustPos4.xyz;
    vec3 toDust = worldDustPos - uLightPos;
    float dustDist = length(toDust);
    vec3 dustRay = toDust / max(dustDist, 0.001);
    float dustSpotCos = dot(dustRay, normalize(uLightDir));
    float dustSpot = smoothstep(uSpotParams.y * 0.85, uSpotParams.x, dustSpotCos);
    float dustDistDecay = 1.0 / (1.0 + 0.045 * dustDist);
    float dustBeam = dustSpot * dustDistDecay;

    float twinkle = 0.75 + 0.28 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
    vec3 dustColor = mix(color * 0.55, vec3(0.90, 0.98, 1.0), dustBeam * 0.80);
    vColor = dustColor * twinkle * (0.95 + dustBeam * 2.0) * 1.20;
    vAlpha = (0.50 + dustBeam * 0.50) * uOpacity;

    gl_PointSize = size * (0.95 + dustBeam * 1.20) * (1080.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 2.6, 7.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const dustFragmentShader = `
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.004) discard;
    vec4 tex = texture2D(pointTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor, vAlpha) * tex;
  }
`

// Laser Scan Beam Shaders (LiDAR Surface Metrology Beam)
const laserVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const laserFragmentShader = `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float dx = abs(vUv.x - 0.5) * 2.0;
    float dy = abs(vUv.y - 0.5) * 2.0;

    // Organic vertical soft fade-out (smoothly dissolves to zero at top & bottom)
    float vFade = smoothstep(1.0, 0.20, dy);

    // Razor-sharp central core laser line & ethereal luminous cyan halo
    float core = smoothstep(0.09, 0.0, dx);
    float halo = pow(clamp(1.0 - dx, 0.0, 1.0), 3.0);

    vec3 cCore = vec3(0.96, 0.99, 1.0);
    vec3 cCyan = vec3(0.24, 0.88, 1.0);
    vec3 cSky = vec3(0.12, 0.52, 1.0);

    vec3 col = mix(cSky, cCyan, halo) + cCore * (core * 1.5);
    float alpha = (core * 0.95 + halo * 0.40) * vFade * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`

interface Gear3DCanvasProps {
  activeMode?: number // 0, 1, 2, 3
  pulseBurst?: number
}

export function Gear3DCanvas({ activeMode = 2, pulseBurst = 0 }: Gear3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modeRef = useRef(activeMode)
  modeRef.current = activeMode
  const burstRef = useRef(pulseBurst)
  burstRef.current = pulseBurst

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    )
    camera.position.set(0, 0, 12.6)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.50
    container.appendChild(renderer.domElement)

    // --- 2. Master Sculpture Assembly Group ---
    const masterGroup = new THREE.Group()
    masterGroup.scale.setScalar(0.72)
    const initialDesktop = (container?.clientWidth ?? window.innerWidth) >= 1024
    masterGroup.position.x = initialDesktop ? -0.45 : 0
    scene.add(masterGroup)

    // --- 3. Key Lighting Parameters (Exact Hero upper-left studio spotlight) ---
    const keyLightPos = new THREE.Vector3(-4.5, 4.2, 5.0)
    const keyLightDir = new THREE.Vector3(0.58, -0.48, -0.65).normalize()
    const spotParams = new THREE.Vector2(
      Math.cos(28 * (Math.PI / 180)),
      Math.cos(75 * (Math.PI / 180))
    )

    // --- 4. Point Texture ---
    const particleTex = createParticleTexture()

    // --- 5. Precision 3D Surface-Sampled Gear Geometries ---
    // Gear 1: Sun Gear (Center 22T)
    const g1Teeth = 22
    const g1Pitch = 1.95
    const g1Geom = createGearPointCloudGeometry({
      teeth: g1Teeth,
      pitchRadius: g1Pitch,
      depth: 0.36,
      holeRadius: 0.54,
      spokes: 5,
      targetPoints: 4800,
    })

    // Gear 2: Planetary Gear (Upper Right 14T)
    const g2Teeth = 14
    const g2Pitch = (g1Pitch / g1Teeth) * g2Teeth // 1.2409
    const phi2 = 0.82
    const dist12 = g1Pitch + g2Pitch
    const c2X = Math.cos(phi2) * dist12
    const c2Y = Math.sin(phi2) * dist12
    const c2Z = 0.05
    const g2Geom = createGearPointCloudGeometry({
      teeth: g2Teeth,
      pitchRadius: g2Pitch,
      depth: 0.32,
      holeRadius: 0.38,
      spokes: 4,
      targetPoints: 2600,
    })

    // Gear 3: Satellite Pinion (Lower Left 10T)
    const g3Teeth = 10
    const g3Pitch = (g1Pitch / g1Teeth) * g3Teeth // 0.8863
    const phi3 = -2.12
    const dist13 = g1Pitch + g3Pitch
    const c3X = Math.cos(phi3) * dist13
    const c3Y = Math.sin(phi3) * dist13
    const c3Z = -0.05
    const g3Geom = createGearPointCloudGeometry({
      teeth: g3Teeth,
      pitchRadius: g3Pitch,
      depth: 0.28,
      holeRadius: 0.28,
      spokes: 3,
      targetPoints: 1600,
    })

    // Materials for Gears
    const createGearMaterial = () => new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTex },
        uTime: { value: 0 },
        uLightPos: { value: keyLightPos },
        uLightDir: { value: keyLightDir },
        uSpotParams: { value: spotParams },
        uStress: { value: 0 },
        uGather: { value: 1.0 },
        uDissolve: { value: 0.0 },
        uOpacity: { value: 1.0 },
        uAssemble: { value: 0 },
      },
      vertexShader: gearVertexShader,
      fragmentShader: gearFragmentShader,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const g1Mat = createGearMaterial()
    const g2Mat = createGearMaterial()
    const g3Mat = createGearMaterial()

    // Gear Points and Groups
    const gearSystemGroup = new THREE.Group()
    masterGroup.add(gearSystemGroup)

    const gear1Group = new THREE.Group()
    const gear1Points = new THREE.Points(g1Geom, g1Mat)
    gear1Group.add(gear1Points)
    gearSystemGroup.add(gear1Group)

    const gear2Group = new THREE.Group()
    gear2Group.position.set(c2X, c2Y, c2Z)
    const gear2Points = new THREE.Points(g2Geom, g2Mat)
    gear2Group.add(gear2Points)
    gearSystemGroup.add(gear2Group)

    const gear3Group = new THREE.Group()
    gear3Group.position.set(c3X, c3Y, c3Z)
    const gear3Points = new THREE.Points(g3Geom, g3Mat)
    gear3Group.add(gear3Points)
    gearSystemGroup.add(gear3Group)

    // --- 6. FEA Laser Scanner Sweep Beam (Phase 02: LiDAR Metrology Scan) ---
    const laserGroup = new THREE.Group()
    const laserGeom = new THREE.PlaneGeometry(0.38, 4.2)
    const laserMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.0 },
      },
      vertexShader: laserVertexShader,
      fragmentShader: laserFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const laserMesh = new THREE.Mesh(laserGeom, laserMat)
    laserGroup.add(laserMesh)

    laserGroup.position.set(0, 0, 0.28)
    laserGroup.visible = false
    gearSystemGroup.add(laserGroup)

    // --- 8. Contact Shear Sparks (Phases 03, 04, 05) ---
    const contactX = Math.cos(phi2) * g1Pitch
    const contactY = Math.sin(phi2) * g1Pitch
    const contactSparkCount = 90
    const contactSparkGeom = new THREE.BufferGeometry()
    const contactSparkPos = new Float32Array(contactSparkCount * 3)
    const contactSparkVels = new Float32Array(contactSparkCount * 3)
    const contactSparkAges = new Float32Array(contactSparkCount)
    const contactSparkLifes = new Float32Array(contactSparkCount)

    for (let i = 0; i < contactSparkCount; i++) {
      contactSparkPos[i * 3] = contactX
      contactSparkPos[i * 3 + 1] = contactY
      contactSparkPos[i * 3 + 2] = 0.05
      const a = phi2 + Math.PI * 0.5 + (Math.random() - 0.5) * 1.5
      const spd = 1.5 + Math.random() * 4.0
      contactSparkVels[i * 3] = Math.cos(a) * spd
      contactSparkVels[i * 3 + 1] = Math.sin(a) * spd
      contactSparkVels[i * 3 + 2] = (Math.random() - 0.5) * 1.5
      contactSparkAges[i] = Math.random() * 0.3
      contactSparkLifes[i] = 0.2 + Math.random() * 0.35
    }

    contactSparkGeom.setAttribute('position', new THREE.BufferAttribute(contactSparkPos, 3))
    const contactSparkMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.065,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTex,
    })
    const contactSparks = new THREE.Points(contactSparkGeom, contactSparkMat)
    gearSystemGroup.add(contactSparks)

    // --- 9. Holographic Solution Converged Reticle (Phase 06) ---
    const reticleGroup = new THREE.Group()
    reticleGroup.position.set(contactX, contactY, 0.40)
    reticleGroup.scale.setScalar(0.001)

    const reticleRingGeom = new THREE.RingGeometry(0.32, 0.35, 48)
    const reticleRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const reticleRing = new THREE.Mesh(reticleRingGeom, reticleRingMat)
    reticleGroup.add(reticleRing)

    const reticleOuterRingGeom = new THREE.RingGeometry(0.48, 0.50, 48)
    const reticleOuterRingMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.50,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const reticleOuterRing = new THREE.Mesh(reticleOuterRingGeom, reticleOuterRingMat)
    reticleGroup.add(reticleOuterRing)

    const leaderLineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.35, 0.35, 0),
      new THREE.Vector3(0.95, 0.95, 0),
      new THREE.Vector3(1.65, 0.95, 0),
    ])
    const leaderLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const leaderLine = new THREE.Line(leaderLineGeom, leaderLineMat)
    reticleGroup.add(leaderLine)

    gearSystemGroup.add(reticleGroup)

    // --- 10. Interactive Mouse / Touch Parallax Dragging ---
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let targetRotX = 0.12
    let targetRotY = -0.15
    let currentRotX = 0.12
    let currentRotY = -0.15

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      prevMouseX = clientX
      prevMouseY = clientY
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (isDragging) {
        const deltaX = clientX - prevMouseX
        const deltaY = clientY - prevMouseY
        prevMouseX = clientX
        prevMouseY = clientY
        targetRotY += deltaX * 0.005
        targetRotX += deltaY * 0.005
        targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX))
        targetRotY = Math.max(-0.8, Math.min(0.8, targetRotY))
      } else {
        const rect = container.getBoundingClientRect()
        const nx = ((clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((clientY - rect.top) / rect.height - 0.5) * 2
        targetRotX = 0.12 - ny * 0.22
        targetRotY = -0.15 + nx * 0.28
      }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    const domEl = renderer.domElement
    domEl.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    domEl.addEventListener('touchstart', handlePointerDown, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    // --- 11. Animation Loop ---
    let animId = 0
    const clock = new THREE.Clock()
    let mainAngle = 0
    let lastBurstId = burstRef.current
    let simStartTime = -1
    const simDuration = 7200
    let curReticleScale = 0.0

    const ratio12 = g1Teeth / g2Teeth
    const ratio13 = g1Teeth / g3Teeth
    const offset2 = phi2 * (1 + ratio12) + Math.PI / g2Teeth + 0.08
    const offset3 = phi3 * (1 + ratio13) + Math.PI / g3Teeth - 0.02

    const smoothstep = THREE.MathUtils.smoothstep

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()
      const now = performance.now()

      // Detect simulation trigger
      if (burstRef.current !== lastBurstId) {
        lastBurstId = burstRef.current
        simStartTime = now
      }

      // Scroll-driven orb disperse removed: gears stay solidly assembled.
      // (scrollBridge.tick() kept to drive the shared smoothing clock.)
      const scrollState = scrollBridge.tick()
      void scrollState
      const rawAssembleP = 1.0

      // Simulation sequence variables
      let simSpeedFactor = 1.0
      let reticleTargetScale = 0.0
      let cameraKick = 0.0

      // Dynamic Nano-Orb Simulation Drivers ("pelan-pelan kekumpul jadi gear")
      let g1Gather = 1.0
      let g2Gather = 1.0
      let g3Gather = 1.0
      let g1Dissolve = 0.0
      let g2Dissolve = 0.0
      let g3Dissolve = 0.0
      let g1Opacity = 1.0
      let g2Opacity = 1.0
      let g3Opacity = 1.0
      let stressLevel = 0.0

      // Per-phase gear group visibility control
      let g1Visible = rawAssembleP > 0.001
      let g2Visible = rawAssembleP > 0.001
      let g3Visible = rawAssembleP > 0.001

      if (simStartTime > 0) {
        const simElapsed = now - simStartTime
        const simT = Math.min(1.0, simElapsed / simDuration)

        if (simT < 0.14) {
          // Phase 01: Slow-Motion Smooth Dissolution into Cosmos (0% - 14%, ~1.0s)
          const t1 = simT / 0.14
          const easeOut = smoothstep(0.0, 1.0, t1)
          // All gears dissolve simultaneously — orbs drift apart into ambient cosmos
          g1Dissolve = easeOut
          g2Dissolve = easeOut
          g3Dissolve = easeOut
          g1Opacity = 1.0
          g2Opacity = 1.0
          g3Opacity = 1.0
          g1Gather = 1.0
          g2Gather = 1.0
          g3Gather = 1.0
          // All gears visible but dissolving out
          g1Visible = true
          g2Visible = true
          g3Visible = true

          simSpeedFactor = 1.0 - easeOut * 0.92
          contactSparkMat.opacity = 0.0
          reticleTargetScale = 0.0
          laserGroup.visible = false
        } else if (simT < 0.44) {
          // Phase 02: Sun Gear (22T) slowly gathers from ambient orbs (14% - 44%, ~2.2s)
          const t2 = (simT - 0.14) / 0.30
          g1Gather = smoothstep(0.0, 1.0, t2)
          g1Dissolve = 0.0
          g1Opacity = Math.min(1.0, t2 * 3.5)
          g2Dissolve = 0.0
          g3Dissolve = 0.0
          // Gear 2 & 3 are COMPLETELY HIDDEN — only Gear 1 orbs appear
          g1Visible = true
          g2Visible = false
          g3Visible = false

          // Laser scanning metrology plane sweeps across center sun gear
          laserGroup.visible = true
          laserGroup.position.x = -1.55 + t2 * 3.10
          laserMat.uniforms.uOpacity.value = Math.sin(t2 * Math.PI) * 0.95

          simSpeedFactor = smoothstep(0.20, 1.0, t2) * 0.35
          contactSparkMat.opacity = 0.0
          reticleTargetScale = 0.0
        } else if (simT < 0.68) {
          // Phase 03: Planetary Gear (14T) slowly gathers & meshes (44% - 68%, ~1.7s)
          const t3 = (simT - 0.44) / 0.24
          g1Gather = 1.0
          g1Dissolve = 0.0
          g1Opacity = 1.0
          g2Gather = smoothstep(0.0, 1.0, t3)
          g2Dissolve = 0.0
          g2Opacity = Math.min(1.0, t3 * 3.5)
          g3Dissolve = 0.0
          // Gear 3 STILL HIDDEN — only Gear 1 & newly gathering Gear 2
          g1Visible = true
          g2Visible = true
          g3Visible = false
          laserGroup.visible = false

          contactSparkMat.opacity = smoothstep(0.50, 0.85, t3) * 0.85
          simSpeedFactor = 0.35 + 0.30 * t3
          reticleTargetScale = 0.0
        } else if (simT < 0.84) {
          // Phase 04: Satellite Pinion (10T) slowly gathers & locks (68% - 84%, ~1.2s)
          const t4 = (simT - 0.68) / 0.16
          g1Gather = 1.0
          g1Dissolve = 0.0
          g1Opacity = 1.0
          g2Gather = 1.0
          g2Dissolve = 0.0
          g2Opacity = 1.0
          g3Gather = smoothstep(0.0, 1.0, t4)
          g3Dissolve = 0.0
          g3Opacity = Math.min(1.0, t4 * 3.5)
          // All 3 gears visible — Gear 3 orbs stream in
          g1Visible = true
          g2Visible = true
          g3Visible = true
          laserGroup.visible = false

          contactSparkMat.opacity = 0.85
          simSpeedFactor = 0.65 + 0.35 * t4
          reticleTargetScale = 0.0
        } else if (simT < 0.96) {
          // Phase 05: Dynamic Torque Test & von Mises Heatmap (84% - 96%)
          const t5 = (simT - 0.84) / 0.12
          g1Gather = 1.0; g1Dissolve = 0.0; g1Opacity = 1.0
          g2Gather = 1.0; g2Dissolve = 0.0; g2Opacity = 1.0
          g3Gather = 1.0; g3Dissolve = 0.0; g3Opacity = 1.0
          g1Visible = true; g2Visible = true; g3Visible = true
          laserGroup.visible = false

          simSpeedFactor = 1.0 + 2.4 * Math.sin(t5 * Math.PI)
          stressLevel = Math.sin(t5 * Math.PI)
          contactSparkMat.opacity = 0.95

          cameraKick = -0.10 * Math.sin(t5 * Math.PI)
          reticleTargetScale = 0.0
        } else {
          // Phase 06: Solution Converged & Hotspot Reticle (96% - 100%)
          g1Gather = 1.0; g1Dissolve = 0.0; g1Opacity = 1.0
          g2Gather = 1.0; g2Dissolve = 0.0; g2Opacity = 1.0
          g3Gather = 1.0; g3Dissolve = 0.0; g3Opacity = 1.0
          g1Visible = true; g2Visible = true; g3Visible = true
          laserGroup.visible = false

          simSpeedFactor = 1.0
          stressLevel = 0.65
          contactSparkMat.opacity = 0.25
          reticleTargetScale = 1.0
          if (curReticleScale < 0.3) curReticleScale = 0.6

          if (simElapsed > simDuration + 9000) {
            simStartTime = -1
          }
        }
      } else {
        // Idle State: Fully assembled kinetic gear transmission
        laserGroup.visible = false
        contactSparkMat.opacity = 0.0
        stressLevel = 0.0
        reticleTargetScale = 0.0
        simSpeedFactor = 1.0
        g1Gather = 1.0; g1Dissolve = 0.0; g1Opacity = 1.0
        g2Gather = 1.0; g2Dissolve = 0.0; g2Opacity = 1.0
        g3Gather = 1.0; g3Dissolve = 0.0; g3Opacity = 1.0
      }

      // Apply per-phase gear group visibility
      gear1Group.visible = g1Visible
      gear2Group.visible = g2Visible
      gear3Group.visible = g3Visible

      // Smoothly animate holographic reticle scale and rotation
      curReticleScale += (reticleTargetScale - curReticleScale) * 0.14
      reticleGroup.scale.setScalar(Math.max(0.001, curReticleScale))
      if (curReticleScale > 0.02) {
        reticleRing.rotation.z = time * 0.4
        reticleOuterRing.rotation.z = -time * 0.25
      }

      // Animate contact shear sparks
      if (contactSparkMat.opacity > 0.02) {
        const cPos = contactSparkGeom.attributes.position.array as Float32Array
        for (let i = 0; i < contactSparkCount; i++) {
          contactSparkAges[i] += delta
          if (contactSparkAges[i] > contactSparkLifes[i]) {
            contactSparkAges[i] = 0
            cPos[i * 3] = contactX + (Math.random() - 0.5) * 0.12
            cPos[i * 3 + 1] = contactY + (Math.random() - 0.5) * 0.12
            cPos[i * 3 + 2] = 0.05 + (Math.random() - 0.5) * 0.15
            const a = phi2 + Math.PI * 0.5 + (Math.random() - 0.5) * 1.5
            const spd = 2.0 + Math.random() * 5.0
            contactSparkVels[i * 3] = Math.cos(a) * spd
            contactSparkVels[i * 3 + 1] = Math.sin(a) * spd
            contactSparkVels[i * 3 + 2] = (Math.random() - 0.5) * 2.0
          } else {
            cPos[i * 3] += contactSparkVels[i * 3] * delta
            cPos[i * 3 + 1] += contactSparkVels[i * 3 + 1] * delta
            cPos[i * 3 + 2] += contactSparkVels[i * 3 + 2] * delta
          }
        }
        contactSparkGeom.attributes.position.needsUpdate = true
      }

      // Living breath on fixed upper-left key light (synchronized with Hero atmosphere)
      const curLightX = -4.5 + Math.sin(time * 0.35) * 0.15
      const curLightY = 4.2 + Math.cos(time * 0.30) * 0.12
      const curLightZ = 5.0 + Math.sin(time * 0.25) * 0.10
      keyLightPos.set(curLightX, curLightY, curLightZ)

      // Update Gear 1 Shader Uniforms
      g1Mat.uniforms.uTime.value = time
      g1Mat.uniforms.uStress.value = stressLevel
      g1Mat.uniforms.uGather.value = g1Gather
      g1Mat.uniforms.uDissolve.value = g1Dissolve
      g1Mat.uniforms.uOpacity.value = g1Opacity
      g1Mat.uniforms.uAssemble.value = rawAssembleP

      // Update Gear 2 Shader Uniforms
      g2Mat.uniforms.uTime.value = time
      g2Mat.uniforms.uStress.value = stressLevel
      g2Mat.uniforms.uGather.value = g2Gather
      g2Mat.uniforms.uDissolve.value = g2Dissolve
      g2Mat.uniforms.uOpacity.value = g2Opacity
      g2Mat.uniforms.uAssemble.value = rawAssembleP

      // Update Gear 3 Shader Uniforms
      g3Mat.uniforms.uTime.value = time
      g3Mat.uniforms.uStress.value = stressLevel
      g3Mat.uniforms.uGather.value = g3Gather
      g3Mat.uniforms.uDissolve.value = g3Dissolve
      g3Mat.uniforms.uOpacity.value = g3Opacity
      g3Mat.uniforms.uAssemble.value = rawAssembleP

      // Camera dynamic shockwave distance
      camera.position.z = 12.6 + cameraKick

      // Mode-based speed modulation
      const m = modeRef.current
      const speedFactor = m === 0 ? 0.45 : m === 1 ? 0.65 : m === 2 ? 0.85 : 1.15
      const baseRPM = 0.28 * speedFactor * simSpeedFactor

      // Synchronous conjugate rotation
      mainAngle += delta * baseRPM
      gear1Group.rotation.z = mainAngle
      gear2Group.rotation.z = -mainAngle * ratio12 + offset2
      gear3Group.rotation.z = -mainAngle * ratio13 + offset3

      // Smooth interactive inertia
      currentRotX += (targetRotX - currentRotX) * 0.08
      currentRotY += (targetRotY - currentRotY) * 0.08
      masterGroup.rotation.x = currentRotX
      masterGroup.rotation.y = currentRotY

      renderer.render(scene, camera)
    }

    animate()

    // --- 12. Resize Handler ---
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / (h || 1)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      const isDesktop = w >= 1024
      masterGroup.position.x = isDesktop ? -0.45 : 0
    }

    window.addEventListener('resize', handleResize)

    // --- 13. Disposal Cleanup ---
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      domEl.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      domEl.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)

      g1Geom.dispose()
      g2Geom.dispose()
      g3Geom.dispose()
      g1Mat.dispose()
      g2Mat.dispose()
      g3Mat.dispose()

      laserGeom.dispose()
      laserMat.dispose()

      contactSparkGeom.dispose()
      contactSparkMat.dispose()

      reticleRingGeom.dispose()
      reticleRingMat.dispose()
      reticleOuterRingGeom.dispose()
      reticleOuterRingMat.dispose()
      leaderLineGeom.dispose()
      leaderLineMat.dispose()

      if (particleTex) particleTex.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  )
}
