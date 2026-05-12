// Minimal type stubs for three.js JSM loaders that ship without .d.ts files
declare module 'three/examples/jsm/loaders/OBJLoader' {
  import { Loader, Group } from 'three'
  import type { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

  export class OBJLoader extends Loader {
    setMaterials(materials: MTLLoader.MaterialCreator): this
    load(
      url: string,
      onLoad?: (object: Group) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void
    parse(data: string): Group
  }
}

declare module 'three/examples/jsm/loaders/MTLLoader' {
  import { Loader, Material } from 'three'

  export class MTLLoader extends Loader {
    load(
      url: string,
      onLoad?: (materialCreator: MTLLoader.MaterialCreator) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void
  }

  export namespace MTLLoader {
    interface MaterialCreator {
      preload(): void
      materials: Record<string, Material>
    }
  }
}
