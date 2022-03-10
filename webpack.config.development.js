const webpack=require("webpack")
const HtmlWebpackPlugin=require("html-webpack-plugin")
const path = require("path")
const BundleAnalyzer=require("webpack-bundle-analyzer")
const Dotenv=require("dotenv-webpack")
const port=process.env.PORT||3000
module.exports={
    mode:"development",
    entry: "./src/app/index.js",//entry: "./src/index.tsx",
    output: {
        path:path.join(__dirname,"dist"),
        publicPath:"/",
        clean:true,
        filename: "[name].[fullhash].js",
    },
    devtool:"inline-source-map",
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html",
            favicon:"public/favicon.ico"
        }),
        
        new BundleAnalyzer.BundleAnalyzerPlugin(),
        
        new Dotenv()
    ],
    optimization:{
        minimize:false,
        splitChunks:{
            cacheGroups:{
               vendors:{
                   test:/[\\/]node_modules[\\/]/,
                   name:'vendors',
                   chunks:'all'
               }
            }

        }
    },
    devServer:{
        historyApiFallback:true,
        hot:true,
        host:"localhost",
        port:port,
        open:true,
        watchFiles:['./src/app/**/*.jsx','./src/app/**/*.js']
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                resolve:{
                    extensions:[".js",".jsx"],
                    alias:{
                        "react-icons":"react-icons/fa/index.esm.js"
                    }
                },
                use:['babel-loader']
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader:"style-loader"
                    },
                    {
                        loader:"css-loader",
                        options:{
                            modules:true,
                            localsConvention:"camelCase",
                            sourceMap:true
                        }
                    }
                ]
            },
            {
                test:/\.(png|svg|jpe?g|gif|ico|woff|woff2|eot|ttf|svg)$/,
                loader:'file-loader',
                options:{
                    name:'[path][name].[ext]',
                    outputPath:"assets"
                }
            },
        ]
    }
}

