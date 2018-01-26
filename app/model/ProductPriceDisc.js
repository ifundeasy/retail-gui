Ext.define('A.model.ProductPriceDisc', {
    extend: 'Ext.data.Model',
    pathURL: '/api/productPriceDisc',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'productPrice_id', type: 'int'},
        {name: 'discount_id', type: 'int'},
        {name: 'discount_name', type: 'string'},
        {name: 'discount_isPercent', type: 'string'},
        {name: 'discount_value', type: 'float'},
        {name: 'discount_status_id', type: 'int'},
        {name: 'discount_notes', type: 'string'},
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
        {name: 'discount_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});