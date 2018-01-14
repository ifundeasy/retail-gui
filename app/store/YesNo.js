Ext.define('A.store.YesNo', {
    extend: 'Ext.data.Store',
    fields: ['id', 'name'],
    data: [
        {id: '1', name: 'Yes'},
        {id: '0', name: 'No'}
    ]
});