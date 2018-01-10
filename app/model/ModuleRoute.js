Ext.define('A.model.ModuleRoute', {
    extend: 'Ext.data.Model',
    pathURL: 'moduleRoute',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'TABLENAME', type: 'string'},
        {name: 'value', type: 'string'},
        {name: 'httpmethod_id', type: 'int'},
        {name: 'httpmethod_name', type: 'string'},
        {name: 'httpmethod_code', type: 'string'},
        {name: 'httpmethod_status_id', type: 'int'},
        {name: 'httpmethod_notes', type: 'string'},
        {name: 'module_id', type: 'int'},
        {name: 'module_module_id', type: 'int'},
        {name: 'module_name', type: 'string'},
        {name: 'module_class', type: 'string'},
        {name: 'module_seq', type: 'int'},
        {name: 'module_status_id', type: 'int'},
        {name: 'module_notes', type: 'string'},
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
        {name: 'value', type: 'string'},
        {name: 'httpmethod_id', type: 'int'},
        {name: 'module_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});