import common from 'eslint-config-neon/flat/common.js';
import edge from 'eslint-config-neon/flat/edge.js';
import node from 'eslint-config-neon/flat/node.js';
import prettier from 'eslint-config-neon/flat/prettier.js';
import typescript from 'eslint-config-neon/flat/typescript.js';
import merge from 'lodash.merge';

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, { files: [`**/*${commonFiles}`] });

const typeScriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	languageOptions: {
		parserOptions: {
			warnOnUnsupportedTypeScriptVersion: false,
			allowAutomaticSingleRunInference: true,
			project: [
				'tsconfig.eslint.json',
				'apps/*/tsconfig.eslint.json',
				'packages/*/tsconfig.eslint.json',
			],
		},
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': [2, 'interface'],
		'import/no-absolute-path': 'off',
		'n/prefer-global/process': 'off',
		'no-restricted-globals': 'off',
		'no-param-reassign': 'off',
		'no-negated-condition': 'off',
		'@typescript-eslint/no-invalid-void-type': 'off',
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: [
					'tsconfig.eslint.json',
					'apps/*/tsconfig.eslint.json',
					'packages/*/tsconfig.eslint.json',
				],
			},
		},
	},
});

const edgeRuleset = merge(...edge, { files: [`apps/**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: [
			'**/node_modules/',
			'.git/',
			'**/dist/',
			'**/template/',
			'**/coverage/',
			'**/storybook-static/',
			'**/.next/',
			'**/*.spec.*',
			'copy-assets.cjs',
			'postBuild.cjs',
			'ecosystem.config.cjs',
			'jest.config.cjs',
		],
	},
	commonRuleset,
	nodeRuleset,
	typeScriptRuleset,
	{
		files: ['**/*{ts,mts,cts,tsx}'],
		rules: { 'jsdoc/no-undefined-types': 0 },
	},
	{
		files: [`packages/rest/**/*${commonFiles}`],
		rules: {
			'n/prefer-global/url': 0,
			'n/prefer-global/url-search-params': 0,
			'n/prefer-global/buffer': 0,
			'no-restricted-globals': 0,
			'unicorn/prefer-node-protocol': 0,
			'no-param-reassign': 0,
		},
	},
	{
		files: [`packages/voice/**/*${commonFiles}`],
		rules: { 'no-restricted-globals': 0 },
	},
	edgeRuleset,
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 0 },
	},
	prettierRuleset,
];
