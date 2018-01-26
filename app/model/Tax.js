Ext.define('A.model.Tax', {
    extend: 'Ext.data.Model',
    pathURL: '/api/tax',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'isPercent', type: 'string'},
        {name: 'value', type: 'float'},
        {name: 'status_id', type: 'int'},
        {name: 'status_name', type: 'string'},
        {name: 'status_notes', type: 'string'},
        {name: 'notes', type: 'string'},
        {
            name: '_',
            type: 'auto',
            convert: function (val, rec) {
                return {id: rec.raw.id}
            }
        }
    ],
    writer: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'isPercent', type: 'string'},
        {name: 'value', type: 'float'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});