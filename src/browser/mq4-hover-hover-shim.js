/*eslint-env browser */
/* jshint browser: true, esnext: true */

/**
* Does this UA's primary pointer support true hovering
* OR does the UA at least not try to quirkily emulate hovering,
* such that :hover CSS styles are appropriate?
* Essentially tries to shim the `@media (hover: hover)` CSS media query feature.
* @type {boolean}
*/
export function supportsTrueHover() {
    if (!window.matchMedia) {
        // Opera Mini, IE<=9, ancient, or obscure; per http://caniuse.com/#feat=matchmedia

        // Opera Mini and IE Mobile don't support true hovering, so they're what we'll check for.
        // Other browsers are either:
        // (a) obscure
        // (b) touch-based but old enough not to attempt to emulate hovering
        // (c) old desktop browsers that do support true hovering

        // Explanation of this UA regex:
        // IE Mobile <9 seems to always have "Windows CE", "Windows Phone", or "IEMobile" in its UA string.
        // IE Mobile 9 in desktop view doesn't include "IEMobile" or "Windows Phone" in the UA string,
        // but it instead includes "XBLWP7" and/or "ZuneWP7".
        return !/Opera Mini|IEMobile|Windows (Phone|CE)|(XBL|Zune)WP7/.test(navigator.userAgent);
    }

    // CSSWG Media Queries Level 4 draft
    //     http://drafts.csswg.org/mediaqueries/#hover
    if (window.matchMedia(
            '(hover: none),(-moz-hover: none),(-ms-hover: none),(-webkit-hover: none),' +
            '(hover: on-demand),(-moz-hover: on-demand),(-ms-hover: on-demand),(-webkit-hover: on-demand)'
    ).matches) {
        // true hovering explicitly not supported by primary pointer
        return false;
    }
    if (window.matchMedia('(hover: hover),(-moz-hover: hover),(-ms-hover: hover),(-webkit-hover: hover)').matches) {
        // true hovering explicitly supported by primary pointer
        return true;
    }
    // `hover` media feature not implemented by this browser; keep probing

    // Touch generally implies that hovering is merely emulated,
    // which doesn't count as true hovering support for our purposes
    // due to the quirkiness of the emulation (e.g. :hover being sticky).

    // W3C Pointer Events LC WD, 13 November 2014
    //     http://www.w3.org/TR/2014/WD-pointerevents-20141113/
    // Prefixed in IE10, per http://caniuse.com/#feat=pointer
    const supportsPointerEvents = window.PointerEvent || window.MSPointerEvent;
    if (supportsPointerEvents) {
        const pointerEventsIsTouch = (window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) > 0;
        return !pointerEventsIsTouch;
    }

    // Mozilla's -moz-touch-enabled
    //     https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#-moz-touch-enabled
    if (window.matchMedia('(touch-enabled),(-moz-touch-enabled),(-ms-touch-enabled),(-webkit-touch-enabled)').matches) {
        return false;
    }

    // W3C Touch Events
    //     http://www.w3.org/TR/2013/REC-touch-events-20131010/
    if ('ontouchstart' in window) {
        return false;
    }

    // UA's pointer is non-touch and thus likely either supports true hovering or at least does not try to emulate it.
    return true;
}
