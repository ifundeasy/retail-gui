Ext.define('A.model.District', {
    extend: 'Ext.data.Model',
    pathURL: '/api/district',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'short', type: 'string'},
        {name: 'regency_id', type: 'int'},
        {name: 'regency_name', type: 'string'},
        {name: 'regency_short', type: 'string'},
        {name: 'regency_state_id', type: 'int'},
        {name: 'regency_status_id', type: 'int'},
        {name: 'regency_notes', type: 'string'},
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
        {name: 'short', type: 'string'},
        {name: 'regency_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});