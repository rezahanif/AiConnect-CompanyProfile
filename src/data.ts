export const nav = ['Product', 'Connectors', 'Skills', 'Guides', 'Pricing']

export const ecosystem = [
  { label: 'Revit', glyph: 'Rv', tint: 'linear-gradient(135deg,#3a86ff,#1b4fb0)', logo: '/logos/logo-revit.png' },
  { label: 'AutoCAD', glyph: 'Ac', tint: 'linear-gradient(135deg,#e04b4b,#8a1f1f)', logo: '/logos/logo-autocad.png' },
  { label: 'QGIS', glyph: 'Qg', tint: 'linear-gradient(135deg,#3ec46d,#1f7a45)', logo: '/logos/logo-qgis.png' },
  { label: 'ArcGIS', glyph: 'Ag', tint: 'linear-gradient(135deg,#4b7bec,#26408b)', logo: '/logos/logo-arcgis.png' },
  { label: 'SketchUp', glyph: 'Sk', tint: 'linear-gradient(135deg,#f5a623,#b5730a)', logo: '/logos/logo-sketchup.png' },
  { label: 'SAP2000', glyph: 'Sp', tint: 'linear-gradient(135deg,#7c5cff,#472fa8)', logo: '/logos/logo-sap.png' },
  { label: 'Metashape', glyph: 'Ms', tint: 'linear-gradient(135deg,#26c6da,#0d7d8c)', logo: '/logos/logo-metashape.png' },
  { label: 'MS Project', glyph: 'Of', tint: 'linear-gradient(135deg,#e8663a,#a33d1a)', logo: '/logos/logo-msproject.png' },
  { label: 'Abaqus', glyph: 'Ab', tint: 'linear-gradient(135deg,#607d8b,#37474f)', logo: '/logos/logo-abaqus.png' },
]

export const models = [
  { name: 'Claude', glyph: 'C', tint: '#d97757', logo: '/logos/logo-claude.png' },
  { name: 'GPT', glyph: 'G', tint: '#10a37f', logo: '/logos/logo-chatgpt.png' },
  { name: 'GLM', glyph: 'Z', tint: '#3a86ff', logo: '/logos/logo-glm.png' },
  { name: 'DeepSeek', glyph: 'D', tint: '#7c5cff', logo: '/logos/logo-deepseek.png' },
]

export const skills = [
  { name: 'Engineering Progress Report', tag: 'Reporting' },
  { name: 'Quantity Takeoff', tag: 'BIM' },
  { name: 'Site Analysis', tag: 'GIS' },
  { name: 'BIM Review', tag: 'BIM' },
  { name: 'GIS Analysis', tag: 'Geospatial' },
  { name: 'Project Handover', tag: 'Workflow' },
]

export const guideSteps = [
  'Overview',
  'Requirements',
  'Install',
  'Connect',
  'Example prompts',
  'Recommended workflows',
  'Troubleshooting',
]

export const pricingIncludes = [
  'All current and future connectors',
  'Project context that persists across AI models',
  'Reusable workflows for repeatable tasks',
  'Step-by-step connector guides',
  'Windows, macOS & Linux app',
]

export const footerCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Download', href: '#download' },
      { label: 'Connectors', href: '#connectors' },
      { label: 'Skills', href: '#skills' },
      { label: 'Guides', href: '#guides' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'LinkedIn', href: '#' },
      { label: 'GitHub', href: 'https://github.com/rezahanif' },
      { label: 'Instagram', href: 'https://www.instagram.com/aiconnectfun' },
    ],
  },
  { title: 'Legal', links: [{ label: 'Terms of Use', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Licenses', href: '#' }] },
]

export const mailtoHref =
  'mailto:anjayrendy303@gmail.com?subject=' +
  encodeURIComponent('AiConnect connector request') +
  '&body=' +
  encodeURIComponent(
    'Software requested:\nWhy I need it:\nMy industry:\nOptional details:\n',
  )
