Ext.define('A.model.PersonActor', {
    extend: 'Ext.data.Model',
    pathURL: 'personActor',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'person_id', type: 'int'},
        {name: 'person_name', type: 'string'},
        {name: 'person_username', type: 'string'},
        {name: 'person_password', type: 'string'},
        {name: 'person_salt', type: 'string'},
        {name: 'person_media_id', type: 'int'},
        {name: 'person_gender', type: 'string'},
        {name: 'person_loginCount', type: 'int'},
        {name: 'person_status_id', type: 'int'},
        {name: 'person_notes', type: 'string'},
        {name: 'actor_id', type: 'int'},
        {name: 'actor_name', type: 'string'},
        {name: 'actor_status_id', type: 'int'},
        {name: 'actor_notes', type: 'string'},
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
        {name: 'person_id', type: 'int'},
        {name: 'actor_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});