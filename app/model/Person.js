Ext.define('A.model.Person', {
    extend: 'Ext.data.Model',
    pathURL: '/api/person',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'salt', type: 'string'},
        {name: 'media_id', type: 'int'},
        {name: 'media_name', type: 'string'},
        {name: 'media_TABLENAME', type: 'string'},
        {name: 'media_TABLENAME_id', type: 'int'},
        {name: 'media_status_id', type: 'int'},
        {name: 'media_notes', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'loginCount', type: 'int'},
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
        {name: 'username', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'salt', type: 'string'},
        {name: 'media_id', type: 'int'},
        {name: 'gender', type: 'string'},
        {name: 'loginCount', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});