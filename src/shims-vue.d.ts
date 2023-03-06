/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*/test.js' {
  export const Tx: object
}

declare module 'ethereumjs-tx'
declare module 'vue-metamask'

