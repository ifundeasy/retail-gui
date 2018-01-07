Ext.app.Application.prototype.addController = function (classPath, opts) {
    //https://www.sencha.com/forum/showthread.php?132795-Dynamically-loading-MVC-controller/page2
    let self = this,
        config = opts || {};

    Ext.require(classPath, function () {
        let applier = Ext.apply({
            application: self
        }, config.options || {});
        let controller = Ext.create(classPath, applier);

        self.controllers.add(classPath, controller);

        controller.init();

        if (config.callback) {
            config.callback.call((config.scope || this), config);
        }
    });
};
Ext.data.Store.prototype.Load = function () {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.load({
            scope: self,
            callback: function (records, operation, success) {
                if (success) resolve(records);
                else reject(operation);
            }
        });
    });
};
Ext.data.Store.prototype.Sync = async function () {
    let self = this;
    let helper = async function () {
        return new Promise(function (resolve, reject) {
            self.sync({
                scope: self.proxy,
                callback: function (records, operation, success) {
                    if (records.exceptions.length) {
                        reject(operation);
                    } else resolve(records)
                }
            });
        });
    };

    try {
        return (await helper());
    } catch (e) {
        let errs = e.scope.errors;
        let err = errs[errs.length-1];
        let error = new Error(err.trace);
        error.objective = e;
        return error
    }
};
(function () {
    let ajax = function (config = {}) {
        let request = $.ajax(Object.assign(config, {async: false}));
        let {status, statusText} = request;
        let response = request.responseJSON || request.responseText;
        return {response, status, statusText}
    };
    let baseReq = ajax({url: 'config.json'}),
        base = baseReq.response;

    let backendReq = ajax({url: base.url}),
        backend = backendReq.response;

    if (!backend) {
        window.alert(backendReq.statusText);
        return;
    }

    let {protocol, ip, port, name} = backend;
    backend.origin = `${protocol+ip}:${port}`;

    Ext.application({
        name: 'Axp',
        appFolder: 'app',
        controllers: ['Login'],
        version: base.version,
        title: name,
        enableQuickTips: true,
        backend, ajax,
        launch: function () {
            Ext.create('Ext.container.Viewport', {
                layout: 'fit',
                items: [
                    {xtype: 'loginView'},
                    {xtype: 'mainView'}
                ]
            });
        }
    });
})();