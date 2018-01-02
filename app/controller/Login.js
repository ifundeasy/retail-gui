Ext.define('Axp.controller.Login', {
    ctrlRegister: [
        'Axp.controller.Module',
        'Axp.controller.Content'
    ],
    extend: 'Ext.app.Controller',
    views: ['Main', 'Login'],
    events: {
        'mainView': {
            added: 'onAddedMainView'
        },
        'loginView': {
            added: 'onAddedLoginView'
        },
        'loginView button[action=login]': {
            click: 'onClickLogin'
        },
        'loginView textfield': {
            specialkey: 'onKeyDown'
        },
        'mainView button[action=logout]': {
            click: 'onClickLogout'
        }
    },
    doLogin: function (data = {}) {
        let me = this;
        let {backend, ajax} = me.application;
        let {origin} = backend;

        return ajax({url: origin + '/login', method: 'POST', data});
    },
    loadSession: function () {
        let me = this;
        let {backend, ajax} = me.application;
        let {origin, storageKey} = backend;
        let token = window.localStorage[storageKey];

        if (!token) delete window.localStorage[storageKey];

        let {response} = ajax({
            url: origin,
            headers: {'X-Token': token}
        });

        if (response.logged) {
            backend.logged = response.logged;
            return 1;
        } else {
            delete window.localStorage[storageKey];
        }
    },
    loadUserInfo: function () {
        let me = this;
        let {backend, ajax} = me.application;
        let {origin, storageKey} = backend;
        let token = window.localStorage[storageKey];
        let {response} = ajax({
            url: origin + '/me',
            headers: {'X-Token': token}
        });
        return response.data
    },
    loadModel: function () {
        let me = this;
        let {backend, ajax} = me.application;
        let {origin, storageKey} = backend;
        let token = window.localStorage[storageKey];
        let {response} = ajax({
            url: origin + '/api/_models',
            headers: {'X-Token': token}
        });
        return response.data
    },
    onAddedMainView: function (cmp) {
        let me = this;
        let {backend} = me.application;
        let logged = this.loadSession();
        let loginWindow = cmp.up().down('loginView');

        if (!logged) {
            cmp.hide();
            loginWindow.show();
            return;
        }

        cmp.show();
        loginWindow.hide();
        backend.data = me.loadUserInfo();
        backend.models = me.loadModel();
        me.ctrlRegister.forEach(function (className) {
            me.application.addController(className);
        });
    },
    onClickLogin: function (button) {
        let me = this;
        let {backend} = me.application;
        let {storageKey} = backend;
        let loginWindow = button.up('window'),
            form = loginWindow.down('form'),
            body = form.getValues(),
            {response} = me.doLogin(body),
            errorMessage = 'Network error!';

        if (response) {
            if (response.trace) errorMessage = response.trace || errorMessage;
            else errorMessage = 0
        }
        if (errorMessage) {
            let spanId = 'error-login-message';
            let span = document.getElementById(spanId);
            let id = button.up().el.dom.id + '-targetEl';

            if (span) {
                span.innerText = errorMessage;
            } else {
                span = document.createElement('span');
                span.id = 'error-login-message';
                span.innerText = errorMessage;
                span.style.position = 'absolute';
                span.style.top = '5px';
                span.style.fontStyle = 'italic';
                span.style.color = 'crimson';

                Ext.get(id).dom.prepend(span)
            }
            delete window.localStorage[storageKey];
        } else {
            window.localStorage[storageKey] = response.data.token;
            window.location.reload();
        }
    },
    onKeyDown: function (cmp, event) {
        if (event.button === 12) {
            let loginButton = cmp.up('loginView').down('button');
            this.onClickLogin(loginButton);
        }
    },
    onClickLogout: function (button) {
        let {backend} = this.application;
        backend.logged = false;
        delete window.localStorage[backend.storageKey];
        window.location.reload();
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
        this.control(me.events);
    }
});