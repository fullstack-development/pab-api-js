/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/pab/:path*',
        destination: 'http://localhost:9080/:path*'
      }
    ]
  }
}
