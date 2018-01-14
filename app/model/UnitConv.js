Ext.define('A.model.UnitConv', {
    extend: 'Ext.data.Model',
    pathURL: 'unitConvertion',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'base_id', type: 'int'},
        {name: 'base_name', type: 'string'},
        {name: 'base_short', type: 'string'},
        {name: 'base_value', type: 'float'},
        {name: 'base_unit_id', type: 'int'},
        {name: 'base_status_id', type: 'int'},
        {name: 'base_notes', type: 'string'},
        {name: 'value', type: 'float'},
        {name: 'unit_id', type: 'int'},
        {name: 'unit_name', type: 'string'},
        {name: 'unit_short', type: 'string'},
        {name: 'unit_value', type: 'float'},
        {name: 'unit_unit_id', type: 'int'},
        {name: 'unit_status_id', type: 'int'},
        {name: 'unit_notes', type: 'string'},
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
        {name: 'base_id', type: 'int'},
        {name: 'value', type: 'float'},
        {name: 'unit_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});