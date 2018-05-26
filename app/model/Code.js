Ext.define('A.model.Code', {
    extend: 'Ext.data.Model',
    pathURL: '/api/code',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'TABLENAME', type: 'string'},
        {name: 'W_FIELD_NAME', type: 'string'},
        {name: 'W_FIELD_VALUE', type: 'string'},
        {name: 'value', type: 'string'},
        {name: 'count', type: 'int'},
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
        {name: 'TABLENAME', type: 'string'},
        {name: 'W_FIELD_NAME', type: 'string'},
        {name: 'W_FIELD_VALUE', type: 'string'},
        {name: 'value', type: 'string'},
        {name: 'count', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});