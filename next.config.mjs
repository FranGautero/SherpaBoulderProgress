/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable, no need for experimental flag
  
  // Exclude Supabase Edge Functions from Next.js compilation
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: [/supabase\/functions/],
    });
    return config;
  },
};

export default nextConfig;
