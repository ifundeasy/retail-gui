Ext.define('A.controller.ChangePassword', {
    extend: 'Ext.app.Controller',
    views: ['ChangePassword'],
    refs: [
        {ref: 'window', selector: 'changePassword'},
        {ref: 'currentPassword', selector: 'changePassword textfield[name=currentPassword]'},
        {ref: 'newPassword1', selector: 'changePassword textfield[name=newPassword1]'},
        {ref: 'newPassword2', selector: 'changePassword textfield[name=newPassword2]'},
        {ref: 'saveBtn', selector: 'changePassword button[action=save]'}
    ],
    events: {
        'changePassword': {
            show: 'show'
        },
        'changePassword textfield': {
            change: 'checkNewPassword'
        },
        'changePassword button[action=save]': {
            click: 'clickSaveBtn'
        }
    },
    reset: function () {
        this.getCurrentPassword().reset();
        this.getNewPassword1().reset();
        this.getNewPassword2().reset();
        this.getSaveBtn().setDisabled(0);
    },
    show: function () {
        this.getCurrentPassword().focus();
        this.getSaveBtn().setDisabled(1);
        this.writerErrorMessage(0, '');
    },
    writerErrorMessage: function (is, message) {
        let button = this.getSaveBtn();
        let spanId = 'error-changepass-message';
        let span = document.getElementById(spanId);
        let id = button.up().el.dom.id + '-targetEl';

        if (!span) {
            span = document.createElement('span');
            Ext.get(id).dom.prepend(span);
        }

        span.id = spanId;
        span.innerText = message;
        span.style.position = 'absolute';
        span.style.top = '5px';
        span.style.fontStyle = 'italic';
        span.style.color = is ? 'green' : 'crimson';
    },
    checkNewPassword: function (field) {
        let me = this;
        let pass = me.getCurrentPassword();
        let pass1 = me.getNewPassword1();
        let pass2 = me.getNewPassword2();
        let {username} = A.app.backend.data.user;
        let value = field.getValue();
        let avoids = ['password', '1234', '123456', '098765'];
        let isOK = false, message = '';

        me.getSaveBtn().setDisabled(1);
        if (avoids.indexOf(value) > -1) {
            message = 'New password doesn\'t allowed!';
        } else if (value.length < 6) {
            message = 'New password too short!';
        } else if (value === username) {
            message = 'New password must different with username!';
        } else if (!pass1.getValue() || !pass.getValue()) {
            message = 'Please completing the form..';
        } else if (pass1.getValue() !== pass2.getValue()) {
            message = 'New password doesn\'t match!'
        } else if (pass1.getValue() === pass.getValue()) {
            message = 'New password must different with old password!';
        } else {
            isOK = true;
            me.getSaveBtn().setDisabled(0);
        }
        me.writerErrorMessage(isOK, message);
    },
    clickSaveBtn: async function (btn) {
        let me = this;
        let {ajax, backend} = A.app;
        let {origin} = backend;
        let url = origin + '/changePassword';
        let data = me.getCurrentPassword().up().getValues();
        let headers = {'X-Token': window.localStorage[backend.storageKey]};

        btn.setDisabled(1);

        let request = ajax({url, headers, method: 'POST', data});
        let {response} = request;
        let error = response.trace || request.statusText;
        if (response.data) {
            me.reset();
            me.writerErrorMessage(1, 'Password changed');
        } else {
            if (error.indexOf('Invalid lookup for token') > -1) {
                error = 'Wrong token or expired, please reload the page'
            }
            console.error(error, request);
            me.writerErrorMessage(0, error);
        }
    },
    init: function () {
        let me = this;
        for (let query in me.events) {
            let events = me.events[query];
            for (let e in events) {
                let handler = me[events[e]];
                if (handler) events[e] = handler;
                else delete events[e]
            }
        }
        me.control(me.events);
    }
});