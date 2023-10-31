module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/__tests__/**/*.(ts|tsx)"],
};
