/* eslint-env node */
/* eslint require-jsdoc:0 */
/*!
 * Postprocessor for shimming @media (hover: hover) from Media Queries Level 4
 * https://github.com/twbs/mq4-hover-shim
 * Copyright 2014-2015 Christopher Rebert
 * Licensed under MIT (https://github.com/twbs/mq4-hover-shim/blob/master/LICENSE.txt)
 */

'use strict';

var postcss = require('postcss');
var parseMediaQuery = require('css-mq-parser');


// Returns media type iff the at-rule is: @media optional-media-type (hover: hover) {...}
function mediaTypeIfSimpleHoverHover(atRule) {
    var mediaOrs = parseMediaQuery(atRule.params);
    if (mediaOrs.length !== 1) {
        return false;
    }
    var mediaAnds = mediaOrs[0];
    if (mediaAnds.inverse) {
        return false;
    }
    if (mediaAnds.expressions.length !== 1) {
        return false;
    }

    var mediaExpr = mediaAnds.expressions[0];
    if (mediaExpr.feature === 'hover' && mediaExpr.value === 'hover') {
        return mediaAnds.type;
    }
    else {
        return undefined;
    }
}

function replaceWithItsChildren(atRule) {
    atRule.each(function (child) {
        child.moveBefore(atRule);
    });
    atRule.remove();
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


module.exports = function (opts) {
    return postcss(function process(css) {
        var hoverSelectorPrefix = opts.hoverSelectorPrefix;
        if ((typeof hoverSelectorPrefix) !== 'string') {
            throw new Error('hoverSelectorPrefix option must be a string');
        }

        css.walkAtRules('media', function (atRule) {
            var mediaType = mediaTypeIfSimpleHoverHover(atRule);
            switch (mediaType) {
                case 'all':
                    /* falls through */
                case 'screen': {
                    atRule.walkRules(function (rule) {
                        prefixSelectorsWith(rule, hoverSelectorPrefix);
                    });
                    if (mediaType === 'screen') {
                        atRule.params = 'screen';
                    }
                    else {
                        // Remove tautological @media all {...} wrapper
                        replaceWithItsChildren(atRule);
                    }
                    return;
                }

                case 'print':
                    /* falls through */
                case 'speech': {
                    // These media types never support hovering
                    // Delete always-false media query
                    atRule.remove();
                    return;
                }

                case undefined: {
                    return; // Media query irrelevant or too complicated
                }
                default: {
                    return; // Deprecated media type; take no action.
                }
            }
        });
    });
};
