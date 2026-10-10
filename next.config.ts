import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  async redirects() {
    return [
      {
        source: '/category',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/category/executive-laptop-bags',
        destination: '/products/laptop-office-bags',
        permanent: true,
      },
      {
        source: '/category/sports-bags',
        destination: '/products/sports-gym-bags',
        permanent: true,
      },
      {
        source: '/category/gym-bags',
        destination: '/products/sports-gym-bags',
        permanent: true,
      },
      {
        source: '/category/college-bags',
        destination: '/products/school-college-bags',
        permanent: true,
      },
      {
        source: '/category/office-bags',
        destination: '/products/laptop-office-bags',
        permanent: true,
      },
      {
        source: '/category/custom-bags',
        destination: '/products/custom-manufacturing',
        permanent: true,
      },
      {
        source: '/category/jute-bags',
        destination: '/products/jute-eco-bags',
        permanent: true,
      },
      {
        source: '/category/tote-bags',
        destination: '/products/tote-shopping-bags',
        permanent: true,
      },
      {
        source: '/category/backpack-bags',
        destination: '/products/backpacks',
        permanent: true,
      },
      {
        source: '/category/laptop-bags',
        destination: '/products/laptop-office-bags',
        permanent: true,
      },
      {
        source: '/category/promotional-bags',
        destination: '/products/corporate-promotional-bags',
        permanent: true,
      },
      {
        source: '/category/travel-bags',
        destination: '/products/travel-bags',
        permanent: true,
      },
      {
        source: '/category/sling-shoulder-bags',
        destination: '/products/sling-shoulder-bags',
        permanent: true,
      },
      {
        source: '/category/school-bags',
        destination: '/products/school-college-bags',
        permanent: true,
      },
      {
        source: '/category/corporate-bags',
        destination: '/products/corporate-promotional-bags',
        permanent: true,
      },
      {
        source: '/category/duffel-bags',
        destination: '/products/travel-bags',
        permanent: true,
      },
      {
        source: '/category/lunch-bags',
        destination: '/products/lunch-utility-bags',
        permanent: true,
      },
      {
        source: '/products/apex-pro-tech-laptop-backpack',
        destination: '/product/apex-pro-tech-laptop-backpack',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
