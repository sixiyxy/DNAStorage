module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 11,
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    plugins: ["@typescript-eslint"],
    rules: {
        // 取消必须引入 React 的警告
        "react/react-in-jsx-scope": "off",
    },
};