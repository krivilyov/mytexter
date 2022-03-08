/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "api.my-texter.com"],
  },
  ...nextTranslate(),
};
