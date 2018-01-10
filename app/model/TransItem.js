Ext.define('A.model.TransItem', {
    extend: 'Ext.data.Model',
    pathURL: 'transItem',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'trans_id', type: 'int'},
        {name: 'trans_code', type: 'string'},
        {name: 'trans_trans_id', type: 'int'},
        {name: 'trans_person_id', type: 'int'},
        {name: 'trans_customer_id', type: 'int'},
        {name: 'trans_type_id', type: 'int'},
        {name: 'trans_status_id', type: 'int'},
        {name: 'trans_notes', type: 'string'},
        {name: 'transItem_id', type: 'int'},
        {name: 'qty', type: 'int'},
        {name: 'productPrice_id', type: 'int'},
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
        {name: 'trans_id', type: 'int'},
        {name: 'transItem_id', type: 'int'},
        {name: 'qty', type: 'int'},
        {name: 'productPrice_id', type: 'int'},
        {name: 'person_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});