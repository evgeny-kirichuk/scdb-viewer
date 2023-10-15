const config = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx}'],
	coverageDirectory: 'coverage',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleDirectories: ['node_modules', '<rootDir>'],
	moduleNameMapper: {
		'^~pages(.*)$': '<rootDir>/src/view/pages$1',
		'^~atoms(.*)$': '<rootDir>/src/view/components/atoms$1',
		'^~molecules(.*)$': '<rootDir>/src/view/components/molecules$1',
		'^~organisms(.*)$': '<rootDir>/src/view/components/organisms$1',
		'^~layouts(.*)$': '<rootDir>/src/view/components/layouts$1',
		'^~utils(.*)$': '<rootDir>/src/utils$1',
		'^~view(.*)$': '<rootDir>/src/view$1',
		'^~theme(.*)$': '<rootDir>/src/view/theme$1',
		'^~routes(.*)$': '<rootDir>/src/view/routes$1',
		'^~(.*)$': '<rootDir>/src/$1',
		'\\.(css|scss)$': '<rootDir>/src/utils/testing/_stylesMock.js',
	},
};

module.exports = config;
