const pkg = require('./package')


module.exports = {
  mode: 'spa',
  modern: true,
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: 'blue',
    height: '5px'
  },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~assets/main.scss'
  ],

  build: {
    // vendor: [
    //   'axios',
    //   'element-ui'
    // ],
    babel: {
      plugins: [['component', [{
        libraryName: 'element-ui',
        styleLibraryName: 'theme-default'
      }]]]
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    {
      src: "~/plugins/axios",
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    proxy: true,
    prefix: '/api'
    // See https://github.com/nuxt-community/axios-module#options
  },
  proxy: {
    '/api/': {
      target: 'http://192.168.218.50:8100',
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api"
      }
    }
  },
  /*
  ** Build configuration
  */
  build:
    {
      transpile: [/^element-ui/],

      /*
      ** You can extend webpack config here
      */
      extend(config, ctx) {

      }
    }
}
