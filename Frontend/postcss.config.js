import cssnano from 'cssnano';

export default {
  plugins: [
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
        reduceIdents: false,
        zindex: false,
      }]
    })
  ]
}
