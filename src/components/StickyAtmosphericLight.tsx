import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function StickyAtmosphericLight() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    let width = window.innerWidth
    let height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.7)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Soft Volumetric Atmospheric Light Beams (Upper-Left to Center-Right)
    const volumetricBeamsGroup = new THREE.Group()

    const beamVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const beamFragmentShader = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uAlpha;
      uniform vec3 uColorCore;
      uniform vec3 uColorEdge;
      uniform float uIntensity;

      void main() {
        // Cross-beam soft falloff: 0 at edges (vUv.x = 0 and 1), 1 at center (vUv.x = 0.5)
        float crossDist = abs(vUv.x - 0.5) * 2.0;
        float crossFalloff = smoothstep(1.0, 0.0, crossDist);
        crossFalloff = pow(crossFalloff, 1.85);

        // Longitudinal falloff: beam originates at top (vUv.y = 1.0) and fades toward bottom (vUv.y = 0.0)
        float topFade = smoothstep(1.0, 0.86, vUv.y);
        float alongFalloff = pow(vUv.y, 1.35) * topFade;

        // Atmospheric micro-wisp pulsation
        float wisp = sin(vUv.y * 6.5 - uTime * 0.35 + vUv.x * 3.5) * 0.06
                   + cos(vUv.y * 12.0 + uTime * 0.20 - vUv.x * 5.0) * 0.04;
        float density = clamp(1.0 + wisp, 0.0, 1.25);

        float alpha = crossFalloff * alongFalloff * density * uIntensity * uAlpha;

        // Color gradient from core cyan/ice-white to outer deep cobalt
        vec3 col = mix(uColorEdge, uColorCore, pow(crossFalloff, 1.6) * (0.35 + 0.65 * vUv.y));

        gl_FragColor = vec4(col, alpha);
      }
    `

    interface BeamConfig {
      width: number
      length: number
      position: THREE.Vector3
      rotationZ: number
      intensity: number
      colorCore: THREE.Color
      colorEdge: THREE.Color
    }

    const beamConfigs: BeamConfig[] = [
      {
        // Primary Key Beam - broad soft shaft crossing from upper-left toward center-right
        width: 3.8,
        length: 12.0,
        position: new THREE.Vector3(-0.55, 0.40, 0.15),
        rotationZ: 0.68, // ~39 deg, aligns upper-left to lower-right
        intensity: 0.26,
        colorCore: new THREE.Color(0.28, 0.85, 1.0),
        colorEdge: new THREE.Color(0.04, 0.18, 0.55),
      },
      {
        // Secondary Upper Shaft - high atmospheric halo
        width: 3.2,
        length: 11.2,
        position: new THREE.Vector3(-1.35, 1.35, -0.40),
        rotationZ: 0.72, // ~41 deg
        intensity: 0.18,
        colorCore: new THREE.Color(0.22, 0.72, 0.96),
        colorEdge: new THREE.Color(0.03, 0.14, 0.45),
      },
      {
        // Tertiary Foreground Shaft - delicate foreground depth ray
        width: 2.6,
        length: 10.2,
        position: new THREE.Vector3(0.12, -0.20, 0.65),
        rotationZ: 0.65, // ~37 deg
        intensity: 0.13,
        colorCore: new THREE.Color(0.32, 0.90, 1.0),
        colorEdge: new THREE.Color(0.05, 0.20, 0.52),
      },
    ]

    const beamMaterials: THREE.ShaderMaterial[] = []
    const beamGeometries: THREE.PlaneGeometry[] = []

    beamConfigs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(cfg.width, cfg.length, 1, 16)
      const mat = new THREE.ShaderMaterial({
        vertexShader: beamVertexShader,
        fragmentShader: beamFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 1.0 },
          uIntensity: { value: cfg.intensity },
          uColorCore: { value: cfg.colorCore },
          uColorEdge: { value: cfg.colorEdge },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(cfg.position)
      mesh.rotation.z = cfg.rotationZ
      volumetricBeamsGroup.add(mesh)
      beamGeometries.push(geo)
      beamMaterials.push(mat)
    })

    scene.add(volumetricBeamsGroup)

    const clock = new THREE.Clock()
    let animId = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      beamMaterials.forEach((bMat) => {
        bMat.uniforms.uTime.value = elapsedTime
      })
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      beamGeometries.forEach((geo) => geo.dispose())
      beamMaterials.forEach((mat) => mat.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  )
}
