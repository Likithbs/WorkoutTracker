module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Add any specific configuration for Jasmine if needed
      },
      clearContext: false // Leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/workout-tracker'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    webpack: {
      mode: 'development',
      resolve: {
        fallback: {
          "fs": false
        }
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [
              {
                loader: 'ts-loader',
                options: { transpileOnly: true }
              }
            ],
            exclude: /node_modules/
          }
        ]
      }
    }
  });
};
