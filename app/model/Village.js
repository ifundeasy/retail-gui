Ext.define('A.model.Village', {
    extend: 'Ext.data.Model',
    pathURL: '/api/village',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'short', type: 'string'},
        {name: 'district_id', type: 'int'},
        {name: 'district_name', type: 'string'},
        {name: 'district_short', type: 'string'},
        {name: 'district_regency_id', type: 'int'},
        {name: 'district_status_id', type: 'int'},
        {name: 'district_notes', type: 'string'},
        {name: 'zipcode', type: 'string'},
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
        {name: 'district_id', type: 'int'},
        {name: 'zipcode', type: 'string'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});