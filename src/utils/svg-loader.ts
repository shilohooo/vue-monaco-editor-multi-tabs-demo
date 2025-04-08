// src/utils/svg-loader.ts
interface SvgModule {
  default: string
}

// 使用 Record 类型定义导入的 SVG 文件集合
const svgFiles: Record<string, SvgModule> = import.meta.glob(
  '../assets/icons/*.svg',
  { eager: true }
)

export default function loadSvgIcons(): Record<string, SvgModule> {
  return svgFiles
}
