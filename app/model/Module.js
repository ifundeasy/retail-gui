Ext.define('A.model.Status', {
    extend: 'Ext.data.Module',
    pathURL: 'module',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'module_id', type: 'int'},
        {name: 'module_module_id', type: 'int'},
        {name: 'module_name', type: 'string'},
        {name: 'module_class', type: 'string'},
        {name: 'module_seq', type: 'int'},
        {name: 'module_status_id', type: 'int'},
        {name: 'module_notes', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'class', type: 'string'},
        {name: 'seq', type: 'int'},
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
        {name: 'module_id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'class', type: 'string'},
        {name: 'seq', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});