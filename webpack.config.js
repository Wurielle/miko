// Minimist
// var argv = require('minimist')(process.argv.slice(2));
// var argv = require( 'argv' );
// var args = argv.run();
// console.dir(args);
// User settings
const settings = require('./user.settings.json');
// Node envoironments
const env = process.env.NODE_ENV.trim();
const bs = env === 'browsersync'
    ? true
    : false;
const devServer = env === 'webpackDevServer'
    ? true
    : false;
const dev = env === 'development'
    ? true
    : env === 'browsersync'
        ? true
        : env === 'webpackDevServer'
            ? true
            : false;
const mode = env === 'production'
    ? 'production'
    : 'development';
console.log(`[mode]: ${mode} - [env]: ${env}`);

// Webpack modules
const path = require('path');
const fs = require("fs");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader')
const vue = dev
    ? 'vue/dist/vue.esm.js'
    : 'vue/dist/vue.min.js';
const computed = {
    path: {},
    value: {
        devTool: function() {
            if (dev) {
                return 'source-map';
            } else {
                return ''
            }
        }
    }
};
const ProjectPaths = require('./project-paths.js');
computed.path = new ProjectPaths({env, bs, devServer, mode});
const extractToCSS = new ExtractTextPlugin({
    // publicPath: '../../',
    filename: computed.path.toDIST() + 'css/[name].css',
    disable: devServer
});
const plugins = [
    require('autoprefixer'), extractToCSS, // see first few line to see the definition and the output
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Backbone: "backbone",
        _: "underscore",
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    // function() {
    //     this.plugin("done", function(statsData) {
    //         var stats = statsData.toJson();
    //         // Change main.bundle.js chunks where they are called
    //         if (!stats.errors.length) {
    //             var htmlFiles = [
    //                 'templates/base.html.twig',
    //                 'templates/base_admin.html.twig',
    //             ];
    //             htmlFiles.forEach(function(htmlFileName) {
    //                 var html = fs.readFileSync(Path.join(__dirname, htmlFileName), "utf8");
    //
    //                 var htmlOutput = html.replace(
    //                     /<script\s+src=(["'])(.+?)bundle\.js\1/i,
    //                     "<script src=$1$2" + stats.assetsByChunkName.main[0] + "$1");
    //
    //                 fs.writeFileSync(
    //                     Path.join(__dirname, "", htmlFileName),
    //                     htmlOutput);
    //             });
    //         }
    //     });
    // }
    // new FlowBabelWebpackPlugin(),
];
if (bs && settings.browsersync.enabled) {
    plugins.push(new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development,
        // ./public directory is being served
        port: settings.browsersync.port,
        proxy: settings.browsersync.proxy,
        open: settings.browsersync.open,
        notify: settings.browsersync.notify,
        files: [
            {
                match: [
                    './templates/**/*.twig',
                    computed.path.toPUBLIC+computed.path.toDIST+'css/main.css',
                    computed.path.toPUBLIC+computed.path.toDIST+'js/main.bundle.js'
                ],
                ignore: ['node_modules'],
                fn: function(event, file) {
                    if (event === 'change') {
                        const bs = require('browser-sync').get('bs-webpack-plugin');
                        bs.reload();
                    }
                }
            }
        ]
    }))
} else if (mode === 'production') {
    // plugins.push(new UglifyJSPlugin({
    //     extractComments: true
    // }))
};

module.exports = { // See https://webpack.js.org/concepts/,
    mode: mode,
    watchOptions: {
        // vagrant fix
        poll: true
    },
    stats: {
        children: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        reasons: false,
        usedExports: false
    },
    devtool: computed.value.devTool(),
    target: 'web',
    // target: 'node',
    context: path.resolve(__dirname, './'),
    entry: {
        main: computed.path.toSRC() + 'js/main.ts',
    },
    output: {
        path: path.resolve(__dirname, computed.path.toPUBLIC()),
        publicPath: computed.path.toPUBLICPath(),
        filename: computed.path.toDIST() + 'js/[name].bundle.js'
    },
    devServer: {
        open: true,
        // port: 9000
        contentBase: path.join(__dirname, computed.path.toPUBLIC()),
        historyApiFallback: true,
        // inline: true,
        // hot: true
    },
    module: {
        rules: [
            { // See: https://webpack.js.org/configuration/module/#rule, https://webpack.js.org/concepts/loaders/  Typescript loader
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/, /vendor/ //Symfony's vendor folder
                ],
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            // {
            //     test: /\.js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             babelrc: true
            //         }
            //     }
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, { // Sass loader
                test: /\.s[a|c]ss$/,
                use: extractToCSS.extract({
                    use: [
                        // {
                        //     loader: 'string-replace-loader',
                        //     options: {
                        //         search: 'dist',
                        //         replace: 'aaaaaaaaaaaaaaaa',
                        //     }
                        // },
                        // {
                        //     loader: 'text-transform-loader',
                        //     options: {
                        //         transformText: (content) => {
                        //             // content.replace(/dist/g, 'hewoo')
                        //             fs.writeFile('file-lazy-loader', content);
                        //             console.log(content)
                        //             return content;
                        //         }
                        //     }
                        // },
                        // 'vue-style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                // url: false
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function() {
                                    return [require('autoprefixer')];
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                indentedSyntax: 'sass',
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }, { // Stylus loader
                test: /\.styl$/,
                use: extractToCSS.extract({
                    use: [
                        // 'vue-style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                // url: false
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function() {
                                    return [require('autoprefixer')];
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: "stylus-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }, { // CSS loader
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                // url: false
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function() {
                                    return [require('autoprefixer')];
                                },
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }, { // Mustache loader
                test: /\.html$/,
                use: "mustache-loader"
            }, { // Image loader (Resolving Images path)
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: [/fonts/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: computed.path.toAssetsExport()+'images/[name].[ext]',
                            // this will work for CSS but not for html templates!!
                            publicPath: '../../' // transforms absolute paths to relative paths
                        }
                    }
                ]

            }, { // Font loader
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                exclude: [/images/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: computed.path.toAssetsExport()+'fonts/[name].[ext]',
                            // this will work for CSS but not for html templates!!
                            publicPath: '../../' // transforms absolute paths to relative paths
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts', '.tsx', '.js', '.jsx'
        ],
        alias: {
            'vue$': vue,
            // NOTE: Future improvement would be to not have to import sass variables in all files that need sass varibles https://github.com/vuejs/vue-loader/issues/328
            '@styles': path.resolve(__dirname, computed.path.styles()),
            '@vue-components': path.resolve(__dirname, computed.path.toSRC()+'js/views/vue-components'),
            '@assets': path.resolve(__dirname, computed.path.toAssets()),
            '@images': path.resolve(__dirname, computed.path.toAssets()+'images/'),
            '@js':  path.resolve(__dirname, computed.path.toSRC()+'js/'),
            '@project-paths':  path.resolve(__dirname, 'project-paths.js'),
        }
    },
    plugins: plugins,
    optimization: {
        minimizer: mode === 'production'
            ? [new UglifyJsPlugin({
                // Compression specific options
                uglifyOptions: {
                    sourceMap: false,
                    mangle: false,
                    // Eliminate comments
                    comments: false,
                    compress: {
                        sequences: true, // join consecutive statemets with the “comma operator”
                        properties: true, // optimize property access: a["foo"] → a.foo
                        dead_code: true, // discard unreachable code
                        drop_debugger: true, // discard “debugger” statements
                        unsafe: false, // some unsafe optimizations (see below)
                        conditionals: true, // optimize if-s and conditional expressions
                        comparisons: true, // optimize comparisons
                        evaluate: true, // evaluate constant expressions
                        booleans: true, // optimize boolean expressions
                        loops: true, // optimize loops
                        unused: true, // drop unused variables/functions
                        hoist_funs: true, // hoist function declarations
                        hoist_vars: false, // hoist variable declarations
                        if_return: true, // optimize if-s followed by return/continue
                        join_vars: true, // join var declarations
                        // cascade: true, // try to cascade `right` into `left` in sequences
                        side_effects: true, // drop side-effect-free statements
                        warnings: true, // warn about potentially dangerous optimizations/code
                        drop_console: true
                        // global_defs: {} // global definitions
                    }
                }
            })]
            : [],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};

// Tuto: https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783
// Doc: https://webpack.js.org

// NOTE: const is like var

// NOTE: __dirname refers to the directory where this webpack.config.js lives, which in this blogpost is the project root.

// NOTE: in the output, [name] stands for the entry name of your entry, in this case it's main

// NOTE: queries are now options so if you have something like: {loader: 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'}, you can turn it into {loader: 'image-webpack-loader', options: {bypassOnDebug: true, optimizationLevel: 7, interlaced: false}
// See https://webpack.js.org/guides/migrating/#what-are-options-
