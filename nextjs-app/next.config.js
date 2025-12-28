/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'https://app.strescto.pl/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: 'https://app.strescto.pl/register',
        permanent: true,
      },
      {
        source: '/app',
        destination: 'https://app.strescto.pl',
        permanent: true,
      },
      {
        source: '/signin',
        destination: 'https://app.strescto.pl/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: 'https://app.strescto.pl/register',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
