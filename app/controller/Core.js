Ext.define('A.controller.Core', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.ux.form.CheckboxListCombo',
        'A.other.ElementFix',
        'A.other.SuggestBox'
    ],
    views: ['Content', 'Navigation', 'Login'],
    refs: [
        {ref: 'navView', selector: 'navigation'},
        {ref: 'mainView', selector: 'content'},
        {ref: 'loginWindow', selector: 'login'}
    ],
    events: {
        'login button[action=login]': {
            click: 'onClickLogin'
        },
        'login textfield': {
            specialkey: 'onKeyDown'
        },
        'viewport > container > panel > toolbar > button[action="logout"]': {
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

        response = response || {};

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
    constructModel: function () {
        let avoids = ['op_id'];
        let types = {
            'datetime': 'date',
            'enum': 'string',
            'char': 'string',
            'varchar': 'string',
            'tinyint': 'int',
            'int': 'int',
            'float': 'float',
            'double': 'float'
        };
        let getType = function (str) {
            return Object.keys(types).filter(function(type){
                if (str.indexOf(type) === 0) return 1;
                return 0;
            })[0]
        };
        let obj = {}, models = this.loadModel();
        let getField = function (name, models) {
            let writer = [], reader = [];
            let model = models[name];
            for (let field in model) {
                let info = model[field];
                let type = getType(info.type);
                if (avoids.indexOf(field) === -1) {
                    reader.push({name: field, type: types[type]});
                    writer.push({name: field, type: types[type]});
                    if (info.prefix) {
                        let other = models[info.table_ref];
                        for (let field2 in other) {
                            let info2 = other[field2];
                            let type2 = getType(info2.type);
                            if (field2 !== 'id' && avoids.indexOf(field2) === -1) {
                                reader.push({name: [info.prefix, field2].join('_'), type: types[type2]});
                            }
                        }
                    }
                }
            }
            return {writer, reader};
        };
        for (let table in models) {
            obj[table] = getField(table, models);
            obj[table].meta = models[table];
        }
        return obj;
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
            let loginButton = cmp.up('login').down('button');
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
    },
    onLaunch: function () {
        let {backend} = this.application;
        let logged = this.loadSession();
        let loggedView = this.getNavView().up('viewport').down('container');
        let title = loggedView.down('panel > toolbar > component[todo=appname]');
        let username = loggedView.down('panel > toolbar > component[todo=username]');

        title.el.dom.innerText = backend.name;
        if (logged) {
            this.getLoginWindow().hide();
            loggedView.show();

            backend.data = this.loadUserInfo();
            backend.models = this.constructModel();

            username.el.dom.innerText = 'Logged as ' + backend.data.user.username;
            username.hide();
            username.show();

            this.application.addController('A.controller.Navigation');
        } else {
            loggedView.hide();
            this.getLoginWindow().show();
        }
    }
});