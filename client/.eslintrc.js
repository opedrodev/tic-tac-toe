module.exports = {
    extends: './node_modules/@opedrodev/eslint/index.js',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
}
