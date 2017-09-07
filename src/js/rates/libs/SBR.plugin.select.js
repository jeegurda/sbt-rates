'use strict';

module.exports = function(options) {
    if (!jQuery) {
        throw new Error('jQuery is not defined');
    }
    if (!this.jquery) {
        throw new Error('Pass a proper jQuery object');
    }

    var $ = jQuery;

    var opts = $.extend({
        popup: null,
        selectClass: 'select',
        element: null,
        header: 'header',
        title: 'strong',
        icon: 'em',
        list: 'div',
        listItem: 'span',

        hideOnSelect: true,
        // true or false or 'visual'
        allowClickOnActive: false
    }, options);

    if (typeof opts.popup !== 'function') {
        throw new Error('Pass a proper popup function');
    }

    return this.each(function() {

        if (this.hasAttribute('data-select-initialized')) {
            console.error(this, 'has a select attached already');
            return;
        }

        var select = this;
        var $select = $(select);
        var $selectBox = $('<div class="' + opts.selectClass + '">');
        var $header = $('<header>');
        var $title = $('<strong>');
        var $icon = $('<em>');
        var $optionList = $('<div>');

        $select.after(
            $selectBox.append(
                $header.append(
                    $title,
                    $icon
                )
            ).append(
                $optionList
            )
        );

        var buildOptionList = function() {
            var optionsString = '';

            $select.find('option').each(function() {
                optionsString += '<' + opts.listItem + '>' + this.innerHTML + '</' + opts.listItem + '>';
            });
            $optionList.html(optionsString);
        };

        buildOptionList();

        $select.addClass('hidden');

        var popup = opts.popup.call($header, {
            container: $optionList,
            onhide: function() {
                $selectBox.removeClass('opened');
            },
            onshow: function() {
                $selectBox.addClass('opened');
            }
        });

        $optionList.on('click', opts.listItem, function(e) {
            var $this = $(this);

            if (opts.allowClickOnActive === false) {
                if ($this.hasClass('selected')) {
                    return;
                }
            } else if (opts.allowClickOnActive === 'visual') {
                if ($this.hasClass('selected') && opts.hideOnSelect) {
                    popup.hide();
                    return;
                }
            }

            $title.text(this.textContent);
            var index = $this.index();
            select.selectedIndex = select[index] ? index : -1;

            $optionList.find(opts.listItem).removeClass('selected');
            $this.addClass('selected');

            if (opts.hideOnSelect) {
                popup.hide();
            }
            $select.change();

            try {
                var evt = new Event('change', {
                    bubbles: true,
                    cancelable: true
                });
            } catch(e) {
                // IE way, fails in safari
                var evt = document.createEvent('event');
                evt.initEvent('change', true, true);
            }
            select.dispatchEvent(evt);
        });

        var selectOption = function() {
            var index = select.selectedIndex;

            if (~index) {
                var $listItem = $optionList.find(opts.listItem).eq(index);
                var $prevItem = $listItem.prev();
                var correction;
                if ($prevItem[0]) {
                    var prevItemHeight = $prevItem.outerHeight();
                    if (!prevItemHeight) {
                        console.warn('Prev item exists but it\'s height is 0. Is it visible?');
                    }
                    correction = prevItemHeight / 2;
                } else {
                    correction = 0;
                }
                $listItem.addClass('selected');
                $optionList.scrollTop($listItem.position().top + $optionList.scrollTop() - correction);
                $title.text(select.options[select.selectedIndex].textContent);
            } else {
                // none selected or has no options
                $title.text('');
            }
        };

        // adding custom event that can be triggered to update associated selectbox
        $select.on('update', function() {
            buildOptionList();
            selectOption();
        });

        selectOption();
        select.setAttribute('data-select-initialized', '');
    });
}