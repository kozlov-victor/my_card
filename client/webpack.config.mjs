import * as path from 'path';
import * as fs from 'fs';
import * as ESLintPlugin from 'eslint-webpack-plugin';
import {fileURLToPath} from 'url';


const copyResourcesToSharp = ()=>{
    let indexHtml = fs.readFileSync('./index.html','utf8');
    indexHtml = indexHtml.replace('${build_no}',new Date().getTime()+'');
    fs.writeFileSync('../my_card/bin/Debug/index.html',indexHtml);

    fs.copyFileSync('./out/index.js','../my_card/bin/Debug/index.js');
    fs.copyFileSync('./src/version.json','./out/version.json');

}

class WebpackDonePlugin{
    apply(compiler){
        compiler.hooks.done.tap('compilation',  (stats)=> {
            setTimeout(()=>{
                if (stats.compilation.errors && stats.compilation.errors.length) {
                    console.error('compiled with errors');
                } else {
                    console.log(`compiled at ${new Date()}`);
                    copyResourcesToSharp();
                }
            },10);
        });
    }
}

export default async (env = {})=>{

    const entry = {};
    const output = {};

    entry['index'] = './src/index.ts';
    output.path = path.resolve('./out');

    output.filename = '[name].js';
    output.chunkFilename = "[name].chunk.js";

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const config = {
        entry,
        output,
        target: ['web', 'es5'],
        mode: 'production', //debug ? 'development' : 'production',
        //devtool: 'inline-source-map',
        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, 'node_tools/loaders')]
        },
        watchOptions: {
            aggregateTimeout: 2000,
            ignored: ['**/out/', '/node_modules/'],
        },
        performance: {
            maxEntrypointSize: 1024000,
            maxAssetSize: 1024000
        },
        module: {
            rules: [
                {
                    test: /\.txt/,
                    use: [
                        {loader: "txt/txt-loader",options: {}},
                    ]
                },
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {loader: 'base64/base64-loader',options: {}}
                    ]
                },
                {
                    test: /\.tsx$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: "ts-engine-precompiler/tsx-precompiler"
                        },
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",options: {},
                        },
                    ]
                },
            ]
        },
        resolve: {
            extensions: ['.ts','.tsx','.js'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
            ],
            alias: {
                '@engine': path.resolve(__dirname, 'engine'),
            },
        },
        optimization: {
            minimize: false,
            emitOnErrors: false,
        },
    };

    config.plugins = [
        new ESLintPlugin.default({
            context: '../',
            emitError: true,
            emitWarning: true,
            failOnError: true,
            extensions: ["ts", "tsx"],
        }),
        new WebpackDonePlugin()
    ];

    return config;
}



