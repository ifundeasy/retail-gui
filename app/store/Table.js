Ext.define('A.store.Table', {
    extend: 'Ext.data.Store',
    fields: ['name'],
    data: Object.keys(A.app.backend.models).map(function (e) {
        return {name: e}
    })
});