Ext.define('A.store.Gender', {
    extend: 'Ext.data.Store',
    fields: ['id', 'name'],
    data: [
        {id: '1', name: 'Male'},
        {id: '0', name: 'Female'}
    ]
});