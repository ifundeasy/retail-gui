Ext.define('A.model.TransPayment', {
    extend: 'Ext.data.Model',
    pathURL: '/api/transPayment',
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
        {name: 'paymethod_id', type: 'int'},
        {name: 'paymethod_name', type: 'string'},
        {name: 'paymethod_status_id', type: 'int'},
        {name: 'paymethod_notes', type: 'string'},
        {name: 'number', type: 'string'},
        {name: 'total', type: 'float'},
        {name: 'value', type: 'float'},
        {name: 'change', type: 'float'},
        {name: 'tip', type: 'float'},
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
        {name: 'paymethod_id', type: 'int'},
        {name: 'number', type: 'string'},
        {name: 'total', type: 'float'},
        {name: 'value', type: 'float'},
        {name: 'change', type: 'float'},
        {name: 'tip', type: 'float'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});