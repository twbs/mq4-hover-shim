/* eslint-env node */
'use strict';

var path = require('path');
var CLIENT_SIDE_FEATURE_DETECTOR_FILENAME = 'mq4-hover-shim.js';


module.exports = {
    postprocessorFor: require('./postprocessor'),
    featureDetector: {
        es6: path.join(__dirname, '../browser', CLIENT_SIDE_FEATURE_DETECTOR_FILENAME),
        cjs: path.join(__dirname, '../../dist/cjs', CLIENT_SIDE_FEATURE_DETECTOR_FILENAME),
        umdGlobal: path.join(__dirname, '../../dist/browser', CLIENT_SIDE_FEATURE_DETECTOR_FILENAME)
    }
};
