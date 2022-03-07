declare module '*.scss'

declare module '*.module.scss' {
    const content: Record<string, string>

    export default content
}

declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.gif'

declare module '*.svg' {
    import React = require('react')

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}
