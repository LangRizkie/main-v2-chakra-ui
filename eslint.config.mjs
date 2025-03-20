import { FlatCompat } from '@eslint/eslintrc'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import sonarjs from 'eslint-plugin-sonarjs'
import sort from 'eslint-plugin-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname
})

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	...pluginQuery.configs['flat/recommended'],
	{
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					vars: 'all',
					varsIgnorePattern: '^_'
				}
			]
		}
	},
	sort.configs['flat/recommended'],
	eslintPluginPrettier,
	eslintConfigPrettier,
	sonarjs.configs.recommended
]

export default eslintConfig
