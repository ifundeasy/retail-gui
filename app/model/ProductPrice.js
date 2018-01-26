Ext.define('A.model.ProductPrice', {
    extend: 'Ext.data.Model',
    pathURL: '/api/productPrice',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'product_id', type: 'int'},
        {name: 'product_name', type: 'string'},
        {name: 'product_product_id', type: 'int'},
        {name: 'product_brand_id', type: 'int'},
        {name: 'product_status_id', type: 'int'},
        {name: 'product_notes', type: 'string'},
        {name: 'price', type: 'float'},
        {name: 'type_id', type: 'int'},
        {name: 'type_name', type: 'string'},
        {name: 'type_status_id', type: 'int'},
        {name: 'type_notes', type: 'string'},
        {name: 'unit_id', type: 'int'},
        {name: 'unit_name', type: 'string'},
        {name: 'unit_short', type: 'string'},
        {name: 'unit_value', type: 'float'},
        {name: 'unit_unit_id', type: 'int'},
        {name: 'unit_status_id', type: 'int'},
        {name: 'unit_notes', type: 'string'},
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
        {name: 'product_id', type: 'int'},
        {name: 'price', type: 'float'},
        {name: 'type_id', type: 'int'},
        {name: 'unit_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});