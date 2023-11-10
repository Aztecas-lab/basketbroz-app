module.exports = {
  root: true,
  extends: ["@react-native-community", "airbnb"],
  plugins: ["react", "react-native", "jsx-a11y", "import"],
  rules: {
    "react-native/no-inline-styles": 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
};
