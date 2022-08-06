// Fix for Zora (https://stackoverflow.com/a/70492617)
const withTM = require('next-transpile-modules')(['@zoralabs/v3']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Fix for rjsf (https://github.com/rjsf-team/react-jsonschema-form/issues/2762)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@material-ui/core': false,
      '@material-ui/icons': false,
    };
    return config;
  },
};

module.exports = withTM(nextConfig);
