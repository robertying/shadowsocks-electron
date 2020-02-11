const {
  override,
  useBabelRc,
  removeModuleScopePlugin,
  babelInclude,
  setWebpackTarget
} = require("customize-cra");
const path = require("path");

module.exports = {
  webpack: override(
    useBabelRc(),
    removeModuleScopePlugin(),
    babelInclude([path.resolve("renderer")]),
    setWebpackTarget("electron-renderer")
  ),
  paths: function(paths, env) {
    paths.appIndexJs = path.resolve(__dirname, "renderer/index.tsx");
    paths.appSrc = path.resolve(__dirname, "renderer");
    paths.appTypeDeclarations = path.resolve(
      __dirname,
      "renderer/react-app-env.d.ts"
    );
    return paths;
  }
};
