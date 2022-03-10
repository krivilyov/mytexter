/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: !!process.env.ESLINTER,
  },
  images: {
    domains: ["localhost", "api.my-texter.com"],
  },
  ...nextTranslate(),
};
