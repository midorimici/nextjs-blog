module.exports = {
  images: {
    domains: ['images.ctfassets.net', 'placehold.jp'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      type: 'asset/source',
    })
    return config
  },
}
