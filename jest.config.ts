import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^#imports$': '<rootDir>/node_modules/nuxt/dist/app/compat/capi'
      }
    },
    {
      displayName: 'stores',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/stores/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^#imports$': '<rootDir>/node_modules/nuxt/dist/app/compat/capi'
      }
    },
    {
      displayName: 'components',
      testEnvironment: '@happy-dom/jest-environment',
      testMatch: ['<rootDir>/components/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
        '^.+\\.vue$': '@vue/vue3-jest'
      },
      transformIgnorePatterns: [
        'node_modules/(?!(vuetify|@vue|@mdi)/)'
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^#imports$': '<rootDir>/node_modules/nuxt/dist/app/compat/capi',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.components.ts']
    }
  ]
}

module.exports = config 