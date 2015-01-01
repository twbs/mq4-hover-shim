/*eslint-env node */
/*!
 * Postprocessor for shimming @media (hover: hover) from Media Queries Level 4
 * https://github.com/cvrebert/mq4-hover-hover-shim
 * Copyright 2014 Christopher Rebert
 * Licensed under MIT (https://github.com/cvrebert/mq4-hover-hover-shim/blob/master/LICENSE.txt)
 */

'use strict';

var postcss = require('postcss');
var mediaQuery = require('css-mediaquery');


// Checks whether the at-rule is: @media (hover: hover) {...}
function isSimpleMediaHoverHover(atRule) {
    var mediaOrs = mediaQuery.parse(atRule.params);
    if (mediaOrs.length > 1) {
        return false;
    }
    var mediaAnds = mediaOrs[0];
    if (mediaAnds.inverse) {
        return false;
    }
    if (mediaAnds.expressions.length > 1) {
        return false;
    }
    var mediaExpr = mediaAnds.expressions[0];
    return mediaExpr.feature === 'hover' && mediaExpr.value === 'hover';
}

function replaceWithItsChildren(atRule) {
    atRule.each(function (child) {
        child.moveBefore(atRule);
    });
    atRule.removeSelf();
}

// Prefixes each selector in the given rule with the given prefix string
function prefixSelectorsWith(rule, selectorPrefix) {
    // Yes, this parsing is horribly naive.

    // We don't use rule.selectors because it's "some kind of hack" per https://github.com/postcss/postcss/issues/37
    // and it doesn't preserve inter-selector whitespace.
    var selectorsWithWhitespace = rule.selector.split(',');

    var revisedSelectors = selectorsWithWhitespace.map(function (selectorWithWhitespace) {
        var quadruple = /^(\s*)(\S.*\S)(\s*)$/.exec(selectorWithWhitespace);
        if (quadruple === null) {
            // Skip weirdness
            return selectorWithWhitespace;
        }

        var prefixWhitespace = quadruple[1];
        var selector = quadruple[2];
        var suffixWhitespace = quadruple[3];

        var revisedSelector = prefixWhitespace + selectorPrefix + selector + suffixWhitespace;
        return revisedSelector;
    });
    rule.selector = revisedSelectors.join(',');
}


module.exports = postcss(function process(css, opts) {
    var hoverSelectorPrefix = opts.hoverSelectorPrefix;
    if ((typeof hoverSelectorPrefix) !== 'string') {
        throw new Error('hoverSelectorPrefix option must be a string');
    }

    css.eachAtRule('media', function (atRule) {
        if (!isSimpleMediaHoverHover(atRule)) {
            return;
        }

        atRule.eachRule(function (rule) {
            prefixSelectorsWith(rule, hoverSelectorPrefix);
        });

        replaceWithItsChildren(atRule);
    });
});
