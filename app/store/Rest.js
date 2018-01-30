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
            exception: function (proxy, res) {
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
    getFilter: function () {
        let filter, self = this;
        try {
            filter = JSON.parse(self.proxy.extraParams.filter);
        } catch (e) {
            //
        }
        return filter;
    },
    setFilter: function (criteria) {
        if (criteria) {
            this.proxy.extraParams.filter = JSON.stringify(criteria);
        } else {
            delete this.proxy.extraParams.filter;
        }
        return this;
    },
    Filter: function (criteria) {
        let self = this;

        self.setFilter(criteria);
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
    Sort: function (field, direction) {
        let self = this;
        self.sort(field, direction);
        return new Promise(function (resolve, reject) {
            let z = setInterval(function () {
                if (!self.isLoading()) {
                    clearInterval(z)
                    resolve();
                }
            }, 100);
        });
    },
    PreviousPage: function () {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.previousPage({
                scope: self,
                callback: function (records, operation, success) {
                    if (success) resolve(records);
                    else reject(operation);
                }
            });
        });
    },
    NextPage: function () {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.nextPage({
                scope: self,
                callback: function (records, operation, success) {
                    if (success) resolve(records);
                    else reject(operation);
                }
            });
        });
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
            let err = errs[errs.length - 1];
            let error = new Error(err.trace);
            error.objective = e;
            return error;
        }
    },
    listeners: {
        beforeload: function (store, eOpts) {
            eOpts.params = eOpts.params || {};

            let {backend} = A.app;
            let url = backend.origin;

            this.proxy.headers['X-Token'] = window.localStorage[backend.storageKey];
            this.proxy.url = url + this.model.prototype.pathURL;

            if (!eOpts.params.filter) delete eOpts.params.filter
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