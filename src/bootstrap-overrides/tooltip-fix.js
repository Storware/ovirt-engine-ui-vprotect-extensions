import $ from 'jquery'

/*
 * Override Bootstrap 3.3.7 Tooltip.getPosition() function to fix
 * position issues with SVG elements when the page/viewport is scrolled.
 */
const extension = {
  getPosition ($element) {
    $element = $element || this.$element

    var el = $element[0]
    var isBody = el.tagName === 'BODY'

    var elRect = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }

    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    /*
      * Avoid using $.offset() since it gives incorrect results on SVG elements. Directly compute scroll
      * adjusted position like $.offset() and angular-ui-bootstrap's $position.offset() does.
      *
      * See issues: https://github.com/twbs/bootstrap/issues/20280
      *             https://github.com/twbs/bootstrap/issues/20381
      *             https://github.com/twbs/bootstrap/issues/21855
      */
    var elOffset = isBody
      ? { top: 0, left: 0 }
      : {
        top: elRect.top + (window.pageYOffset || document.documentElement.scrollTop),
        left: elRect.left + (window.pageXOffset || document.documentElement.scrollLeft)
      }

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }
}

$.extend(true, $.fn.tooltip.Constructor.prototype, extension)
