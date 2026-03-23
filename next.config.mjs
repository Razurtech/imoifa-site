/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/glossary",
        destination: "/en/glossary",
        permanent: true,
      },
      {
        source: "/glossary/:slug",
        destination: "/en/glossary/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
