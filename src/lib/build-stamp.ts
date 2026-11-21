declare const __BUILD_STAMP__: string;

/** One string for a whole build, worked out once in astro.config.mjs: the commit it was made from, else the build's time. */
export const buildStamp: string = __BUILD_STAMP__;
