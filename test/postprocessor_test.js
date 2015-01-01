/*eslint-env node */
'use strict';

var postprocessor = require('../src/nodejs/postprocessor.js');

/*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit
    Test methods:
        test.expect(numAssertions)
        test.done()
    Test assertions:
        test.ok(value, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
*/

exports.mq4HoverShim = {
    setUp: function (done) {
        // setup here
        done();
    },
    'has no effect when there are no media queries': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process(".foobar { display: none; }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            ".foobar { display: none; }"
        );
        test.done();
    },
    'skips non-media at-rules': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process("@quux (hover: hover) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@quux (hover: hover) { .foobar { display: none; } }"
        );
        test.done();
    },
    'skips media queries with ORs': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process("@media (hover: hover), (orientation: landscape) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (hover: hover), (orientation: landscape) { .foobar { display: none; } }"
        );
        test.done();
    },
    'skips media queries with ANDs': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process("@media (hover: hover) and (orientation: landscape) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (hover: hover) and (orientation: landscape) { .foobar { display: none; } }"
        );
        test.done();
    },
    'skips media queries that are not about the hover media feature': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process("@media (orientation: landscape) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (orientation: landscape) { .foobar { display: none; } }"
        );
        test.done();
    },
    'skips media queries about the hover media feature with a non-hover value': function (test) {
        test.expect(2);
        test.deepEqual(
            postprocessor.process("@media (hover: none) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (hover: none) { .foobar { display: none; } }"
        );
        test.deepEqual(
            postprocessor.process("@media (hover: on-demand) { .foobar { display: none; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (hover: on-demand) { .foobar { display: none; } }"
        );
        test.done();
    },
    'works correctly on a representative example': function (test) {
        test.expect(1);
        test.deepEqual(
            postprocessor.process("@media (hover: hover) { .foobar { color: white; background: red; } div .quux > input { color: blue; background: white; } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "PREFIX>.foobar {\n    color: white;\n    background: red;\n}\nPREFIX>div .quux > input {\n    color: blue;\n    background: white;\n}"
        );
        test.done();
    },
    'handles nested at-rules': function (test) {
        test.expect(2);
        test.deepEqual(
            postprocessor.process("@media (orientation: landscape) { @media (hover: hover) { .foobar { display: none; } } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (orientation: landscape) { PREFIX>.foobar { display: none; } }"
        );
        test.deepEqual(
            postprocessor.process("@media (hover: hover) { @media (orientation: landscape) { .foobar { display: none; } } }", {hoverSelectorPrefix: 'PREFIX>'}).css,
            "@media (orientation: landscape) {\n    PREFIX>.foobar {\n        display: none;\n    }\n}"
        );
        test.done();
    },
    'errors when hoverSelectorPrefix is not provided': function (test) {
        test.expect(1);
        test.throws(function () {
            /*eslint-disable no-unused-expressions */
            postprocessor.process("@media (hover: hover) { .foobar { display: none; } }", {}).css;// jshint ignore:line
            /*eslint-enable no-unused-expressions */
        }, Error, 'hoverSelectorPrefix option must be a string');
        test.done();
    },
    'errors when hoverSelectorPrefix is not a string': function (test) {
        test.expect(1);
        test.throws(function () {
            /*eslint-disable no-unused-expressions */
            postprocessor.process("@media (hover: hover) { .foobar { display: none; } }", {hoverSelectorPrefix: 42}).css;// jshint ignore:line
            /*eslint-enable no-unused-expressions */
        }, Error, 'hoverSelectorPrefix option must be a string');
        test.done();
    }
};
