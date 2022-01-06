const path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const generate = require('@ant-design/colors/lib/generate').default

function resolve(dir) {
  // return path.join(__dirname, dir)
  return path.join(__dirname, dir)
}

// vue.config.js
// ./dists
module.exports = {
  baseUrl: "./",
  outputDir: 'dist',
  assetsDir: 'static', //相对静态资源路径。
  indexPath: 'index.html',
  filenameHashing: true, //默认。
  productionSourceMap: false, //发布去掉sourceMap，泄露源代码

  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

    */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 生成仅包含颜色的替换样式（主题色等）
      new ThemeColorReplacer({
        fileName: 'css/theme-colors.css',
        matchColors: getAntdSerials('#1890ff'), // 主色系列
        // 改变样式选择器，解决样式覆盖问题
        changeSelector(selector) {
          switch (selector) {
            case '.ant-calendar-today .ant-calendar-date':
              return ':not(.ant-calendar-selected-date)' + selector
            case '.ant-btn:focus,.ant-btn:hover':
              return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
            case '.ant-btn.active,.ant-btn:active':
              return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
            default:
              return selector
          }
        }
      }),
        // 热更新替换
      // new webpack.HotModuleReplacementPlugin()
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    // development server port 8000  http://www.woaikuajing.com/  172.16.1.92
    // host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://eborder.com/api/b1/',
        // target: 'http://test.outaokj.com/api/b1/',
        pathRewrite: {
          '^/api': ''
        },
        ws: false,
        changeOrigin: true
      }
    },
    // open:true,  //打包后浏览器打开
    // hot:true,   //热替换
    // inline:true //热加载
  },
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

function getAntdSerials(color) {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}
