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
        {name: 'productCode_code', type: 'string'},
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
        {
            name: 'disc2',
            type: 'float',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '-';

                let v = rec.get('disc');
                let sum = rec.get('qty') - rec.get('qties');
                if (!sum || !v) return '-';
                if (sum == 1) return A.app.formatMoney(v * sum);
                return `${A.app.formatMoney(v * sum)} (${A.app.formatMoney(v)} * ${sum})`
            }
        },
        {
            name: 'tax2',
            type: 'float',
            convert: function (val, rec) {
                if (rec.get('modifier_id')) return '-';

                let v = rec.get('tax');
                let sum = rec.get('qty') - rec.get('qties');
                if (!sum || !v) return '-';
                if (sum == 1) return A.app.formatMoney(v * sum);
                return `${A.app.formatMoney(v * sum)} (${A.app.formatMoney(v)} * ${sum})`
            }
        },
        {name: 'total', type: 'float'},
        {name: 'nett', type: 'float'},
        {name: 'notes', type: 'string'},
        {name: 'info', type: 'string'}
    ]
});