const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
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

module.exports = nextConfig;
