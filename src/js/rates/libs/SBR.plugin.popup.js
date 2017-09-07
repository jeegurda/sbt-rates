'use strict';

module.exports = function(options) {
    if (!jQuery) {
        throw new Error('jQuery is not defined');
    }
    if (!this.jquery) {
        throw new Error('Pass a proper jQuery object');
    }
    if (this[0].hasAttribute('data-popup-initialized')) {
        console.warn(this, 'has a popup already');
    }

    var $ = jQuery;

    var opts = $.extend({
        showClass: 'visible',
        ctx: window,

        container: $(),
        hideEl: $(),
        directHideEl: $(),
        ignoreFrom: $(),
        documentClickClose: true,
        documentEscClose: true,
        showOnClick: true,
        onhide: null,
        onshow: null,
        onclick: null
    }, options);

    this[0].setAttribute('data-popup-initialized', '');
    opts.ctx.popupCounter = opts.ctx.popupCounter || 0;
    var eventNS = '.popup' + opts.ctx.popupCounter++;

    var dontClose = false;
    var visible = false;

    var $this = this;
    var $container = $(opts.container, this);
    var $hideEl = $(opts.hideEl, this);
    var $directHideEl = $(opts.directHideEl, this);
    var $ignoreFrom = $(opts.ignoreFrom, this);
    var $root = $(document);

    if (!$container[0]) {
        return console.warn('Popup: container "%s" not found', opts.container.selector || opts.container);
    }

    var Popup = function() {
        this.hide = function() {
            if (!this.visible()) return;
            visible = false;
            $this.add($container).removeClass(opts.showClass);
            opts.documentClickClose && removeDocumentListener('click');
            opts.documentEscClose && removeDocumentListener('keydown');
            opts.onhide && opts.onhide.call(this);
        };
        this.show = function() {
            if (initialListenerAdded && opts.documentClickClose) { // removing initial listener on a first show
                $root.off('click' + eventNS + '-initial');
                initialListenerAdded = false;
            }
            if (this.visible()) return;
            visible = true;
            $this.add($container).addClass(opts.showClass);
            opts.documentClickClose && addDocumentClickListener();
            opts.documentEscClose && addDocumentEscListener();
            opts.onshow && opts.onshow.call(this);
        };
        this.visible = function() {
            return visible;
        };
    };

    var popup = new Popup();

    var addDocumentClickListener = function() {
        $root.on('click' + eventNS, function(e) {
            if (dontClose) {
                dontClose = false;
            } else {
                popup.hide();
            }
        });
    };

    var addDocumentEscListener = function() {
        $root.on('keydown' + eventNS, function(e) {
            if (e.keyCode === 27) {
                popup.hide();
            }
        });
    };

    var removeDocumentListener = function(e) {
        $root.off(e + eventNS);
    };

    // capturing events before the popup was ever opened (BUT not for Esc)
    if (opts.documentClickClose) {
        $root.on('click' + eventNS + '-initial', function() {
            if (dontClose) {
                dontClose = false;
            }
        });
    }

    var initialListenerAdded = true;

    $container.add($ignoreFrom).on('click', function() {
        dontClose = true;
    });

    $this.click(function() {
        if (opts.showOnClick) {
            if (!visible) {
                popup.show();
                dontClose = true;
            } else if (!opts.documentClickClose) {
                popup.hide();
            }
        }
        opts.onclick && opts.onclick.call(popup, this);
    });

    $hideEl.click(function() {
        popup.hide();
    });

    $directHideEl.click(function(e) {
        if (e.target === this) popup.hide();
    });

    if ($container.hasClass(opts.showClass)) {
        popup.show();
    }

    return popup;
};