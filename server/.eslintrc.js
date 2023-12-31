module.exports = {
    extends: './node_modules/@opedrodev/eslint/index.js',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'no-console': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
    },
}
