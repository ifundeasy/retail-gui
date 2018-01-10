Ext.define('A.model.National', {
    extend: 'Ext.data.Model',
    pathURL: 'national',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'iso2', type: 'string'},
        {name: 'iso3', type: 'string'},
        {name: 'numcode', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'phonecode', type: 'string'},
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
        {name: 'iso2', type: 'string'},
        {name: 'iso3', type: 'string'},
        {name: 'numcode', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'phonecode', type: 'string'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});