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

        //controller.init();

        if (config.callback) {
            config.callback.call((config.scope || this), config, controller)
        }
    });
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
        name: 'A',
        appFolder: 'app',
        controllers: ['A.controller.Login'],
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