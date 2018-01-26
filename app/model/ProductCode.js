Ext.define('A.model.ProductCode', {
    extend: 'Ext.data.Model',
    pathURL: '/api/productCode',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'code', type: 'string'},
        {name: 'product_id', type: 'int'},
        {name: 'product_name', type: 'string'},
        {name: 'product_product_id', type: 'int'},
        {name: 'product_brand_id', type: 'int'},
        {name: 'product_status_id', type: 'int'},
        {name: 'product_notes', type: 'string'},
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
        {name: 'code', type: 'string'},
        {name: 'product_id', type: 'int'},
        {name: 'status_id', type: 'int'},
        {name: 'notes', type: 'string'}
    ]
});