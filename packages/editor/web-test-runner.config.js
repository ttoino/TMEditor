process.env.NODE_ENV = "test";

export const plugins = [require("@snowpack/web-test-runner-plugin")()];
