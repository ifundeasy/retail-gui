Ext.define('A.soap.Transaction', {
    extend: 'Ext.data.Model',
    pathURL: '/soap/transaction',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'code', type: 'string'},
        {name: 'type_id', type: 'int'},
        {name: 'person_id', type: 'int'},
        {name: 'person_name', type: 'string'},
        {name: 'subject_id', type: 'int'},
        {
            name: 'subject_name', type: 'string', convert: function (val) {
                if (!val) return '-';
                return val;
            }
        },
        {name: 'numofprod', type: 'int'},
        {name: 'total', type: 'float'},
        {name: 'paywith', type: 'float'},
        {name: 'applied', type: 'float'},
        {name: 'change', type: 'float'},
        {name: 'tip', type: 'float'},
        {name: 'balance', type: 'float'},
        {
            name: 'dc', type: 'date', convert: function (val) {
                return Ext.Date.format(new Date(val), 'H:i')
            }
        },
        {
            name: 'isdone', type: 'boolean', convert: function (val, d) {
                let total = d.get('total');
                let paywith = d.get('paywith');
                let num = d.get('numofprod');
                if (!num) return false;
                return paywith >= total;
            }
        },
        {
            name: 'paidoff', type: 'boolean', convert: function (val, d) {
                let balance = d.get('balance');
                let num = d.get('numofprod');
                if (!num) return false;
                return !(balance > 0)
            }
        }
    ]
});