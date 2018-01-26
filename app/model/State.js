Ext.define('A.model.State', {
    extend: 'Ext.data.Model',
    pathURL: '/api/state',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'short', type: 'string'},
        {name: 'national_id', type: 'int'},
        {name: 'national_iso2', type: 'string'},
        {name: 'national_iso3', type: 'string'},
        {name: 'national_numcode', type: 'int'},
        {name: 'national_name', type: 'string'},
        {name: 'national_phonecode', type: 'string'},
        {name: 'national_status_id', type: 'int'},
        {name: 'national_notes', type: 'string'},
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
        {name: 'national_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});