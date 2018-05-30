Ext.define('A.soap.TransactionItem', {
    extend: 'Ext.data.Model',
    pathURL: '/soap/transactionItem',
    fields: [
        {name: 'no', type: 'auto'},
        {name: 'id', type: 'int'},
        {name: 'trans_id', type: 'int'},
        {name: 'person_id', type: 'int'},
        {name: 'person_name', type: 'string'},
        {name: 'modifier_id', type: 'int'},
        {name: 'modifier_name', type: 'string'},
        {name: 'transItem_id', type: 'auto'},
        {
            name: 'product_name',
            type: 'string',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '&mdash; ' + rec.get('modifier_name');
                return val;
            }
        },
        {name: 'qty', type: 'float'},
        {name: 'qties', type: 'float'},
        {
            name: 'productPrice_price',
            type: 'float',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '';
                return val;
            }
        },
        {name: 'unit_id', type: 'int'},
        {
            name: 'unit_name',
            type: 'string',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '';
                return val;
            }
        },
        {
            name: 'disc',
            type: 'float',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '';
                return val;
            }
        },
        {
            name: 'tax',
            type: 'float',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '';
                return val;
            }
        },
        {name: 'total', type: 'float'},
        {name: 'nett', type: 'float'},
        {name: 'notes', type: 'string'},
        {name: 'info', type: 'string'}
    ]
});