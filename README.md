# mq4-hover-hover-shim
[![NPM version](https://badge.fury.io/js/mq4-hover-hover-shim.svg)](http://badge.fury.io/js/mq4-hover-hover-shim)
[![Build Status](https://img.shields.io/travis/cvrebert/mq4-hover-hover-shim/master.svg)](https://travis-ci.org/cvrebert/mq4-hover-hover-shim)
[![Dependency Status](https://david-dm.org/cvrebert/mq4-hover-hover-shim.svg)](https://david-dm.org/cvrebert/mq4-hover-hover-shim)
[![devDependency Status](https://david-dm.org/cvrebert/mq4-hover-hover-shim/dev-status.svg)](https://david-dm.org/cvrebert/mq4-hover-hover-shim#info=devDependencies)

A shim for the [Media Queries Level 4 `hover` @media feature](http://drafts.csswg.org/mediaqueries/#hover).

The CSSWG's [Media Queries Level 4 Working Draft](http://drafts.csswg.org/mediaqueries/) defines a [`hover` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) that can be used in media queries. This can be used to determine whether the user-agent's primary pointing device truly supports hovering (like mice do) (the `hover` value), or emulates hovering (e.g. via a long tap, like most modern touch-based mobile devices) (the `on-demand` value), or does not support hovering at all (like some old mobile devices) (the `none` value). This matters because emulated hovering typically has some ugly quirks, such as [`:hover`](hover-pseudo) being "sticky" (i.e. a hovered element stays in the [`:hover` state](hover-pseudo) even after the user stops interacting with it and until the user hovers over a different element). It is often better to avoid `:hover` styles in browsers where hovering supports is emulated.

However, since it's from a relatively recent Working Draft, the `hover` media feature is not supported in all current modern browsers or in any legacy browsers. So, this library was created to shim support for the feature into browsers that lack native support for it.

NOTE: This shim only adds support for the `hover` value of the `hover` media feature. So you can only tell the difference between "truly supports hovering" (the `hover` value)" and "does not truly support hovering" (the `none` or `on-demand` values).

The shim consists of two parts:
* A [PostCSS](https://github.com/postcss/postcss)-based server-side CSS postprocessor that rewrites
```css
@media (hover: hover) {
    some-selector {
        property: value;
    }
}
```
into
```css
some-prefix some-selector {
    property: value;
}
```
(In normal use-cases, `some-selector` will contain the `:hover` pseudo-class and `some-prefix` will be a specially-named CSS class that will typically be added to the `<html>` element.)
* A client-side JavaScript library that detects whether the user-agent truly supports hovering. If the check returns true, then your code can add the special CSS class to the appropriate element to enable [`:hover`](hover-pseudo) styles; for example:
```js
if (mq4HoverShim.supportsTrueHover()) {
    document.documentElement.className += ' some-special-class';
}
```

[hover-pseudo]: https://developer.mozilla.org/en-US/docs/Web/CSS/:hover

## Browser compatibility

The following is a summary of the results of testing the library in various browsers. [Try out the Live Testcase](http://jsfiddle.net/cvrhulu/5vszkpmg/).

Legend:
* True positive - Browser supports real hovering, and mq4-hover-hover-shim reports that it supports real hovering
* True negative - Browser does NOT support real hovering, and mq4-hover-hover-shim reports that it does NOT support real hovering
* False negative - Browser supports real hovering, and mq4-hover-hover-shim reports that it does NOT support real hovering
* False positive - Browser does NOT supports real hovering, and mq4-hover-hover-shim reports that it supports real hovering
* ??? - This case has yet to be tested.

Officially supported:
* Blink (Chrome & recent Opera) - **False negative due to [Chromium bug #441613](http://crbug.com/441613)**
* Firefox (latest stable version)
  * Desktop - True positive
  * Android - ???
* Android browser
  * Android 5.0 - True negative
  * Android 4.0 - True negative
* Internet Explorer
  * Desktop
    * 11 - True positive
    * 10 - True positive
    * 9 - True positive
    * 8 - True positive
  * Mobile 11
    * Mobile mode - ???
    * Desktop mode - ???
* Safari (WebKit)
  * iOS 8.1 - True negative
  * 8 on OS X - True positive

Unofficially supported:
* Presto (old Opera 12) desktop - True positive
* Internet Explorer Mobile 10 - ???
* Internet Explorer Mobile 9 - ???

## API
(To-Be-Documented)

## Grunt
Use [grunt-postcss](https://github.com/nDmitry/grunt-postcss) to invoke the mq4-hover-hover-shim CSS postprocessor via [Grunt](http://gruntjs.com/) task.

## Contributing
The project's coding style is laid out in the JSHint, ESLint, and JSCS configurations. Add unit tests when changing the CSS postprocessor. Lint and test your code using [Grunt](http://gruntjs.com/). Manually test any changes to the browser-side portion of the shim.

_Also, please don't edit files in the `dist` subdirectory as they are generated via Grunt. You'll find source code in the `src` subdirectory!_

## Release History
See the [GitHub Releases page](https://github.com/cvrebert/mq4-hover-hover-shim/releases) for detailed changelogs.
* (next release) - `master`
* 2014-12-31 - v0.0.1: Initial release

## License
Copyright (c) 2014-2015 Christopher Rebert. Licensed under the MIT License.
