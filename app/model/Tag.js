Ext.define('A.model.Tag', {
    extend: 'Ext.data.Model',
    pathURL: 'tag',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'tag_id', type: 'int'},
        {name: 'tag_name', type: 'string'},
        {name: 'tag_tag_id', type: 'int'},
        {name: 'tag_status_id', type: 'int'},
        {name: 'tag_notes', type: 'string'},
        {name: 'status_id', type: 'int'},
        {name: 'status_name', type: 'string'},
        {name: 'status_notes', type: 'string'},
        {name: 'notes', type: 'string'}
        ,
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
        {name: 'tag_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});