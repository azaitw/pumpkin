X.manage = {
    attrs: {},
    event: function () {
        var that = this,
            editBtn = $('.btn-edit'),
            cancelBtn = $('.btn-cancel'),
            saveBtn = $('.btn-save');
        var filterBtn = $('.filter-btn');
        
        editBtn.click(function (e) {
            that.toggleEdit(e);
        });
        cancelBtn.click(function (e) {
            that.toggleEdit(e);
        });
        saveBtn.click(function (e) {
            that.toggleEdit(e, 'save');
        });
        filterBtn.click(function (e) {
            that.filterResult();
        });
    },
    filterResult: function (e) {
        var filters = X.manage.getFilters();
        var listItems = $('.tr-manage');
        var listItemsLen = listItems.length;
        var flags = [];
        var placeholder;
        var placeholder1;
        var flagsLen;
        var i;
        var j;
        for (j in filters) {
            if (filters.hasOwnProperty(j) && filters[j] !== 'all') {
                for (i = 0; i < listItemsLen; i += 1) {
                    flags[i] = true;
                    placeholder = listItems[i].querySelectorAll('select.' + j + ' option:checked');
                    placeholder1 = $(placeholder).val();
                    if (placeholder1 !== filters[j]) {
                        flags[i] = false;
                    }
                }
                flagsLen = flags.length;
            }
        }
        for (i = 0; i < flagsLen; i += 1) {
            if (flags[i] === false) {
                $(listItems[i]).addClass('D-n');
            } else {
                $(listItems[i]).removeClass('D-n');
            }
        }
    },
    getFilters: function () {
        var filters = $('.select-filter');
        var filtersLen = filters.length;
        var filtersArr = {};
        var placeholder;
        var i;
        for (i = 0; i < filtersLen; i += 1) {
            placeholder = $(filters[i]);
            filtersArr[placeholder.data('filter')] = placeholder.children('option:selected').val();
        }
        return filtersArr;
    },
    toggleEdit: function (e, option) {
        var parentNode = $(e.currentTarget).parent(),
            toggles = parentNode.children('.btn-toggle'),
            select = parentNode.children('.select-edit'),
            oldVal,
            newVal;

        if (parentNode.hasClass('editmode')) { // button save or cancel
            oldVal = this.attrs[select];
            newVal = select.val();
            if (option === 'save' && newVal !== oldVal) {
                this.submitUpdate(select); // submit change
            } else {
                select.val(oldVal);
            }
            parentNode.removeClass('editmode');
            select.attr('disabled', 'true');
        } else { // switch to edit mode. button 'edit'
            this.attrs[select] = select.val(); // save original value
            parentNode.addClass('editmode');
            select.removeAttr('disabled');
        }
    },
    
    submitUpdate: function (node) {
        var orderId = node.data('oid'),
            field = node.data('field'),
            newVal = node.val();
            console.log('newVal: ', newVal);
        $.post(
            '/' + X.params.brand + '/manage/order/update',
            {
                id: orderId,
                field: field,
                value: newVal
            },
            function (data) {
                console.log('data: ', data);
            }
        );
    }
};
X.manage.event();