/// <reference types="vite/client" />

/**
 * `vite-imagetools` query imports.
 *
 * Declared by hand rather than pulling in `vite-imagetools/client`, whose own
 * reference types redeclare the base image modules and collide with
 * `vite/client` above. This says only what we use.
 *
 * Note the single wildcard: TypeScript ambient module patterns allow exactly
 * one `*`, so this has to match on the query's tail rather than wrapping it.
 */
declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*&as=url" {
  const url: string;
  export default url;
}
