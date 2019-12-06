'use strict';

/* eslint no-console: "off" */
const webpackConfigs = require('./config/webpack');
const defaultConfig = 'dev';

module.exports = (configName) => {
  // If there was no configuration give, assume default
  const requestedConfig = configName || defaultConfig;
  console.log('requestedConfig ', requestedConfig);
  // Return a new instance of the webpack config
  // or the default one if it cannot be found.
  let LoadedConfig = requestedConfig;

  if (webpackConfigs[requestedConfig] !== undefined) {
    LoadedConfig = webpackConfigs[requestedConfig];
  } else {
    console.warn(`
      Provided environment "${configName}" was not found.
      Please use one of the following ones:
      ${Object.keys(webpackConfigs).join(' ')}
    `);
    LoadedConfig = webpackConfigs[defaultConfig];
  }

  const loadedInstance = new LoadedConfig();
  // Set the global environment
  process.env.NODE_ENV = loadedInstance.env;
  const shouldWatch = !(process.env.NODE_ENV === 'dist' || process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'pre');
  console.log(`shouldWatch ${shouldWatch} for env ${process.env.NODE_ENV}`);
  return { ...loadedInstance.config, watch: shouldWatch };
};
