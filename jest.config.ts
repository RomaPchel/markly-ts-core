import { type JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest";

export default async (): Promise<JestConfigWithTsJest> => {
    const { compilerOptions } = await require("@nyce/config/tsconfig.json");
    // const nyceBaseOptions: Config.InitialOptions = await require("@nyce/config/jest.cjs");

    return {
        preset: "ts-jest/presets/default-esm",
        transform: {
            // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
            // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
            "^.+\\.tsx?$": [
                "ts-jest",
                {
                    useESM: true,
                },
            ],
        },
        testEnvironment: "node",
        extensionsToTreatAsEsm: [".ts"],
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }) ?? {},
        modulePathIgnorePatterns: ["<rootDir>/dist/"],
    };
};
