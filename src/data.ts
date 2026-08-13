export const nav = ['Product', 'Connectors', 'Skills', 'Guides', 'Pricing']

export const ecosystem = [
  { label: 'Revit', glyph: 'Rv', tint: 'linear-gradient(135deg,#3a86ff,#1b4fb0)' },
  { label: 'AutoCAD', glyph: 'Ac', tint: 'linear-gradient(135deg,#e04b4b,#8a1f1f)' },
  { label: 'QGIS', glyph: 'Qg', tint: 'linear-gradient(135deg,#3ec46d,#1f7a45)' },
  { label: 'ArcGIS', glyph: 'Ag', tint: 'linear-gradient(135deg,#4b7bec,#26408b)' },
  { label: 'SketchUp', glyph: 'Sk', tint: 'linear-gradient(135deg,#f5a623,#b5730a)' },
  { label: 'SAP2000', glyph: 'Sp', tint: 'linear-gradient(135deg,#7c5cff,#472fa8)' },
  { label: 'Metashape', glyph: 'Ms', tint: 'linear-gradient(135deg,#26c6da,#0d7d8c)' },
  { label: 'MS Office', glyph: 'Of', tint: 'linear-gradient(135deg,#e8663a,#a33d1a)' },
]

export const models = [
  { name: 'Claude', glyph: 'C', tint: '#d97757' },
  { name: 'GPT', glyph: 'G', tint: '#10a37f' },
  { name: 'GLM', glyph: 'Z', tint: '#3a86ff' },
  { name: 'DeepSeek', glyph: 'D', tint: '#7c5cff' },
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
  'Full connector library',
  'Cross-model Progress Store',
  'Reusable engineering skills',
  'Complete connector guides',
  'Windows, macOS & Linux app',
]

export const footerCols: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Download', 'Connectors', 'Skills', 'Guides', 'Pricing'] },
  { title: 'Developer', links: ['LinkedIn', 'GitHub', 'Instagram'] },
  { title: 'Legal', links: ['Terms', 'Privacy', 'Licenses'] },
]

export const mailtoHref =
  'mailto:?subject=' +
  encodeURIComponent('AiConnect connector request') +
  '&body=' +
  encodeURIComponent(
    'Software requested:\nWhy I need it:\nMy industry:\nOptional details:\n',
  )
