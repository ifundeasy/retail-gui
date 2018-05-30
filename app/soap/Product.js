Ext.define('A.soap.Product', {
    extend: 'Ext.data.Model',
    pathURL: '/soap/product',
    idProperty: 'productCode_id',
    fields: [
        {name: 'brand_id', type: 'int'},
        {name: 'brand_name', type: 'string'},
        {name: 'brand_notes', type: 'string'},
        {name: 'dc', type: 'date'},
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'notes', type: 'string'},
        {name: 'prices', type: 'auto'},
        {name: 'productCode_code', type: 'string'},
        {name: 'productCode_dc', type: 'date'},
        {name: 'productCode_id', type: 'int'},
        {name: 'productCode_notes', type: 'string'},
        {name: 'product_id', type: 'int'},
        {name: 'tags', type: 'auto'}
    ]
});