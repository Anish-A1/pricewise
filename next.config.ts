// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Allow images over HTTPS
        hostname: '**',    // Match any hostname
      },
    ],
  },
};