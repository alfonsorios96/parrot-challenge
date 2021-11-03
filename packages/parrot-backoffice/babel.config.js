module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                useBuiltIns: false,
                forceAllTransforms: true
            }
        ],
        '@babel/preset-react'
    ],
    plugins: [

    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-modules-commonjs'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 10
                        }
                    }
                ]
            ]
        }
    }
};
