/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    mount: {
        public: { url: "/", static: true },
        src: { url: "/dist" },
        "../client-common/src": { url: "/dist-common" },
    },
    plugins: [
        "@snowpack/plugin-react-refresh",
        "@snowpack/plugin-dotenv",
        "snowpack-plugin-yaml",
        "snowpack-svgr-plugin",
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        { match: "routes", src: ".*", dest: "/index.html" },
    ],
    optimize: {
        /* Example: Bundle your final build: */
        bundle: true,
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        hmrPort: parseInt(process.env.HMR_PORT) || 80,
        /* ... */
    },
    buildOptions: {
        /* ... */
    },
    alias: {
        "@app": "./src",
        "@types": "../types",
        "@common": "../client-common/src",
    },
    env: {
        API_URL: process.env.API_URL || "http://localhost/api",
    },
};
