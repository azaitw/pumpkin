X.manage = {
    attrs: {
        
    },
    event: function () {
        var that = this,
            editBtns = $('.table-manage .edit_btn'),
            cancelBtns = $('.table-manage .cancel'),
            saveBtns = $('.table-manage .save');

        editBtns.click(function (e) {
            that.toggleEditMode(e, {toEdit: true});
        });

        cancelBtns.click(function (e) {
            that.toggleEditMode(e);
        });

        saveBtns.click(function (e) {
            that.updateField(e);
        });
    },
    toggleEditMode: function (e, params) {
        var parentNode = $(e.currentTarget).parents('.item');
        parentNode.toggleClass('editmode');
        if (params && params.toEdit) {
            X.manage.attrs.oldValue = parentNode.find('.value').val();
        }
    },
    updateField: function (e) {
        var table = $('.table-manage').data('table'),
            parentNode = $(e.currentTarget).parents('.item'),
            isAggregate = parentNode.data('aggregate'),
            field = parentNode.data('field'),
            value = parentNode.find('.value').val(),
            postData = {
                id: parentNode.data('cid')
            };
        if (value !== X.manage.attrs.oldValue) { // When changed
            if (isAggregate) {
                var dataIndex = parentNode.parents('.tr-manage').data('index'),
                    orgData = X.params.json[dataIndex][isAggregate],
                    key = parentNode.find('li').data('pid');
                orgData[key].count = value;
                postData[field] = orgData;
            } else {
                postData[field] = value;
            }

            $.post(
                '/' + X.params.brand + '/manage/' + table + '/update',
                postData,
                function (data) {
                    parentNode.find('.edit_btn').text(data[field]);
                    X.manage.toggleEditMode(e);
                }
            );
        } else {
            X.manage.toggleEditMode(e);
        }
    }
};
X.manage.event();