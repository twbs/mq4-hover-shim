/*!
 * mq4-hover-shim v0.1.0
 * https://github.com/twbs/mq4-hover-shim
 * Copyright (c) 2014-2015 Christopher Rebert
 * Licensed under the MIT License (https://github.com/twbs/mq4-hover-shim/blob/master/LICENSE).
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mq4HoverShim=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

/**
* Does this UA's primary pointer support true hovering
* OR does the UA at least not try to quirkily emulate hovering,
* such that :hover CSS styles are appropriate?
* Essentially tries to shim the `@media (hover: hover)` CSS media query feature.
* @public
* @returns {boolean}
* @since 0.0.1
*/
exports.supportsTrueHover = supportsTrueHover;
/*eslint-env browser, es6 */
/*eslint no-var:2*/
/* jshint browser: true, esnext: true */
/* jshint -W080 */
/**
* @module mq4HoverShim
* @requires jquery
*/
var $ = (function () {
    try {
        var _import = require('jquery');

        var jQuery = _interopRequireWildcard(_import);

        return jQuery;
    } catch (importErr) {
        var globaljQuery = window.$ || window.jQuery || window.Zepto;
        if (!globaljQuery) {
            throw new Error('mq4HoverShim needs jQuery (or similar)');
        }
        return globaljQuery;
    }
})();

/** @type {boolean|undefined} */
var canTrulyHover = undefined;

/**
* @private
* @fires mq4HoverShim#mq4hsChange
*/
function triggerEvent() {
    $(document).trigger($.Event('mq4hsChange', { bubbles: false, trueHover: canTrulyHover }));
}

// IIFE so we can use `return`s to avoid deeply-nested if-s
(function () {
    if (!window.matchMedia) {
        // Opera Mini, IE<=9, Android<=2.3, ancient, or obscure; per http://caniuse.com/#feat=matchmedia

        // Opera Mini, Android, and IE Mobile don't support true hovering, so they're what we'll check for.
        // Other browsers are either:
        // (a) obscure
        // (b) touch-based but old enough not to attempt to emulate hovering
        // (c) old desktop browsers that do support true hovering

        // Explanation of this UA regex:
        // IE Mobile <9 seems to always have "Windows CE", "Windows Phone", or "IEMobile" in its UA string.
        // IE Mobile 9 in desktop view doesn't include "IEMobile" or "Windows Phone" in the UA string,
        // but it instead includes "XBLWP7" and/or "ZuneWP7".
        canTrulyHover = !/Opera Mini|Android|IEMobile|Windows (Phone|CE)|(XBL|Zune)WP7/.test(navigator.userAgent);

        // Since there won't be any event handlers to fire our events, do the one-and-only firing of it here and now.
        triggerEvent();
        return;
    }

    // CSSWG Media Queries Level 4 draft
    //     http://drafts.csswg.org/mediaqueries/#hover
    var HOVER_NONE = '(hover: none),(-moz-hover: none),(-ms-hover: none),(-webkit-hover: none)';
    var HOVER_ON_DEMAND = '(hover: on-demand),(-moz-hover: on-demand),(-ms-hover: on-demand),(-webkit-hover: on-demand)';
    var HOVER_HOVER = '(hover: hover),(-moz-hover: hover),(-ms-hover: hover),(-webkit-hover: hover)';
    if (window.matchMedia('' + HOVER_NONE + ',' + HOVER_ON_DEMAND + ',' + HOVER_HOVER).matches) {
        // Browser understands the `hover` media feature
        var hoverCallback = function hoverCallback(mql) {
            var doesMatch = mql.matches;
            if (doesMatch !== canTrulyHover) {
                canTrulyHover = doesMatch;
                triggerEvent();
            }
        };
        var atHoverQuery = window.matchMedia(HOVER_HOVER);
        atHoverQuery.addListener(hoverCallback);
        hoverCallback(atHoverQuery);
        return;
    }

    // Check for touch support instead.
    // Touch generally implies that hovering is merely emulated,
    // which doesn't count as true hovering support for our purposes
    // due to the quirkiness of the emulation (e.g. :hover being sticky).

    // W3C Pointer Events PR, 16 December 2014
    //     http://www.w3.org/TR/2014/PR-pointerevents-20141216/
    // Prefixed in IE10, per http://caniuse.com/#feat=pointer
    if (window.PointerEvent || window.MSPointerEvent) {
        // Browser supports Pointer Events

        // Browser supports touch if it has touch points
        /* jshint -W018 */
        canTrulyHover = !((window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) > 0);
        /* jshint +W018 */
        triggerEvent();
        return;
    }

    // Mozilla's -moz-touch-enabled
    //     https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#-moz-touch-enabled
    var touchEnabledQuery = window.matchMedia('(touch-enabled),(-moz-touch-enabled),(-ms-touch-enabled),(-webkit-touch-enabled)');
    if (touchEnabledQuery.matches) {
        canTrulyHover = false;
        triggerEvent();
        return;
    }

    // W3C Touch Events REC, 10 October 2013
    //     http://www.w3.org/TR/2013/REC-touch-events-20131010/
    if ('ontouchstart' in window) {
        canTrulyHover = false;
        triggerEvent();
        return;
    }

    // UA's pointer is non-touch and thus likely either supports true hovering or at least does not try to emulate it.
    canTrulyHover = true;
    triggerEvent();
})();
function supportsTrueHover() {
    return canTrulyHover;
}
},{"jquery":undefined}]},{},[1])(1)
});