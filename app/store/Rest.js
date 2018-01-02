Ext.define('App.store.Rest', {
    extend: 'Ext.data.Store',
    proxy: {
        type: 'ajax',
        defaultHeaders:{
            'Content-Type': 'application/json; charset=utf-8',
        },
        noCache: false,
        writer: {
            type  : 'json',
            encode: true
        }
    }
});