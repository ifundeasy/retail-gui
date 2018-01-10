Ext.define('A.model.ProductPriceTax', {
    extend: 'Ext.data.Model',
    pathURL: 'productPriceTax',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'productPrice_id', type: 'int'},
        {name: 'tax_id', type: 'int'},
        {name: 'tax_name', type: 'string'},
        {name: 'tax_isPercent', type: 'string'},
        {name: 'tax_value', type: 'float'},
        {name: 'tax_status_id', type: 'int'},
        {name: 'tax_notes', type: 'string'},
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
        {name: 'productPrice_id', type: 'int'},
        {name: 'tax_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});