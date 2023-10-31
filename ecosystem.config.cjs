// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'zilya',
        script: 'dist/index.js',
        interpreter: 'node',
        node_args: '--loader ts-node/esm'
    }]
};