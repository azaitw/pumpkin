X.manage = {
    attrs: {},
    event: function () {
        var that = this,
            editBtn = $('.btn-edit'),
            cancelBtn = $('.btn-cancel'),
            saveBtn = $('.btn-save');
        
        editBtn.click(function (e) {
            that.toggleEdit(e);
        });
        cancelBtn.click(function (e) {
            that.toggleEdit(e);
        });
        saveBtn.click(function (e) {
            that.toggleEdit(e, 'save');
        });
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