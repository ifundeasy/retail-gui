Ext.define('A.soap.ProductSummary', {
    extend: 'Ext.data.Model',
    pathURL: '/soap/productSummary',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'product_name', type: 'string'},
        {name: 'brand_id', type: 'int'},
        {name: 'brand_name', type: 'string'},
        {name: 'productPrice_price', type: 'string'},
        {name: 'productCode_code', type: 'string'},
        {name: 'type_name', type: 'string'},
        {name: 'unit_name', type: 'string'},
        {name: 'unit_shortname', type: 'string'},
        {name: 'productPriceDisc_name', type: 'string'},
        {name: 'productPriceDisc_value', type: 'string'},
        {name: 'productPriceDisc_desc', type: 'string'},
        {name: 'productPriceTax_name', type: 'string'},
        {name: 'productPriceTax_value', type: 'string'},
        {name: 'productPriceTax_desc', type: 'string'},
        {name: 'productTag_name', type: 'string'},
        {name: 'status_id', type: 'int'},
        {name: 'status_name', type: 'string'}
    ]
});