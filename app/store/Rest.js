Ext.define('A.store.Rest', {
    extend: 'Ext.data.Store',
    sortOnLoad: true,
    sortOnFilter: true,
    remoteSort: true,
    remoteGroup: true,
    remoteFilter: true,
    proxy: {
        type: 'ajax',
        headers: {
            'Accept': 'application/json',
            'X-Token': undefined
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PUT',
            destroy: 'DELETE'
        },
        startParam: 'offset',
        noCache: false,
        writer: {
            type: 'json'
        },
        reader: {
            type: 'json',
            root: 'data'
        },
        listeners: {
            exception: function(proxy, res) {
                let err = Ext.JSON.decode(res.responseText);
                this.errors = this.errors || [];
                this.errors.push(err);
                Ext.Msg.show({
                    title: 'Error',
                    msg: err.trace,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                console.error(err.trace);
            }
        }
    },
    Load: function () {
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
    },
    Sync: async function () {
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
            return await helper();
        } catch (e) {
            let errs = e.scope.errors;
            let err = errs[errs.length-1];
            let error = new Error(err.trace);
            error.objective = e;
            return error;
        }
    },
    listeners: {
        beforeload: function () {
            let {backend} = A.app;
            let url = backend.origin + '/api/';
            this.proxy.headers['X-Token'] = window.localStorage[backend.storageKey];
            this.proxy.url = url + this.model.prototype.pathURL;
        },
        beforesync: function (options, eOpts) {
            let {backend} = A.app;
            let writerCols = this.model.prototype.writer;

            this.proxy.headers['X-Token'] = window.localStorage[backend.storageKey];

            for (let mod in options) {
                let list = options[mod];
                list.forEach(function (obj) {
                    let data = {_: obj.data._};
                    writerCols.forEach(function (el) {
                        data[el.name] = obj.data[el.name] || '';
                    });
                    obj.data = data;
                })
            }
        }
    }
});