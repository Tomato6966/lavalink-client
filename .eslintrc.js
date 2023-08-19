module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended'],
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: 'module',
        "ecmaVersion": "es2022"
    },
    env: {
       es2022: true
    },
    plugins: ['@typescript-eslint'],
    rules: {
        "@typescript-eslint/no-unsafe-declaration-merging": 1,
        "@typescript-eslint/no-explicit-any": 1
    }
} 