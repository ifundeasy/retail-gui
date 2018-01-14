Ext.define('A.store.Table', {
    extend: 'Ext.data.Store',
    fields: ['name'],
    data: Object.keys(A.app.backend.models).sort().map(function (e) {
        return {name: e}
    })
});