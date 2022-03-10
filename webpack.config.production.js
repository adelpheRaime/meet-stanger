const webpack=require("webpack")
const HtmlWebpackPlugin=require("html-webpack-plugin")
const path = require("path")
const Dotenv=require("dotenv-webpack")
const BrotliPlugin=require("brotli-webpack-plugin")
const BundleAnalyzer=require("webpack-bundle-analyzer")
const port=process.env.PORT||3000
module.exports={
    mode:"production",
    entry: "./src/app/index.js",//entry: "./src/index.tsx",
    output: {
        path:path.join(__dirname,"dist"),
        publicPath:"/",
        clean:true,
        filename: "static/[name].[fullhash].js",
    },
    devtool:"source-map",
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html",
            favicon:"public/favicon.ico"
        }),
        //new BundleAnalyzer.BundleAnalyzerPlugin(),
        new BrotliPlugin({
            asset:'[path].br[query]',
            test:/\.(js|jsx|css|html|png|svg|jpe?g|gif|ico|woff|woff2|eot|ttf)$/,
            threshold:10240,
            minRatio:0.8
        }),
        new webpack.IgnorePlugin({
            resourceRegExp:/^\.\/locale$/,
            contextRegExp:/moment$/
        }),
        new Dotenv()
    ],
    optimization:{
        moduleIds:"deterministic",
        runtimeChunk:"single",
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
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                resolve:{
                    extensions:[".js",".jsx"]
                    //extensions:[".ts",".tsx",".js",".jsx"]
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
                test:/\.(png|svg|jpe?g|ico|gif|woff|woff2|eot|ttf|svg)$/,
                loader:'file-loader',
                options:{
                    name:'[path][name].[ext]',
                    outputPath:"assets"
                }
            },
        ]
    }
}

