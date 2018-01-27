Ext.require([
    'A.model.Type',
    'A.model.Brand',
    'A.model.Product',
    'A.model.ProductCode',
    'A.model.ProductTag',
    'A.model.ProductPrice',
    'A.model.ProductPriceDisc',
    'A.model.ProductPriceTax',
    'A.model.Status',
    'A.soap.Product',
    'A.view.master.ProductWindow'
]);
Ext.define('A.view.master.Product', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterProduct',
    layout: 'fit',
    stores: {},
    initComponent: function () {
        let Type = Ext.create('A.store.Rest', {model: 'A.model.Type'});
        let Brand = Ext.create('A.store.Rest', {model: 'A.model.Brand'});
        let Parent = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let Product = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let ProductCode = Ext.create('A.store.Rest', {model: 'A.model.ProductCode'});
        let ProductTag = Ext.create('A.store.Rest', {model: 'A.model.ProductTag'});
        let ProductPrice = Ext.create('A.store.Rest', {model: 'A.model.ProductPrice'});
        let ProductPriceDisc = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceDisc'});
        let ProductPriceTax = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceTax'});
        let Status = Ext.create('A.store.Rest', {model: 'A.model.Status'});
        let ProductInfo = Ext.create('A.store.Rest', {model: 'A.soap.Product'});
        //
        let columns = [
            //new Ext.grid.RowNumberer(),
            {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
            {
                text: 'Name',
                dataIndex: 'name',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Code',
                dataIndex: 'productCode_code',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Sales Price',
                dataIndex: 'productPrice_price',
                xtype: 'numbercolumn',
                format: ',0.00',
                minWidth: 120,
                autoSizeColumn: true,
                align: 'right'
            },
            {
                text: 'Unit',
                dataIndex: 'unit_name',
                minWidth: 100,
                autoSizeColumn: true,
                renderer: function (val, meta, record, rowIndex) {
                    let value = val === 'NULL' ? null : val;
                    let shortname = record.get('unit_shortname');
                    if (value && shortname) return shortname + ' (' + value + ')';
                    if (value && !shortname) return value;
                    if (!value && shortname) return shortname;
                }
            },
            {
                text: 'Discounts',
                dataIndex: 'productPriceDisc_value',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Taxes',
                dataIndex: 'productPriceTax_value',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Brand',
                dataIndex: 'brand_name',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Tags',
                dataIndex: 'productTag_name',
                minWidth: 200,
                autoSizeColumn: true
            },
            {
                text: 'Status',
                dataIndex: 'status_name',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Notes', dataIndex: 'notes'
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                align: 'center',
                todo: 'edit',
                items: [
                    {
                        xtype: 'button',
                        icon: 'img/icons/essential/png/edit.png',
                        iconCls: 'icon-bg',
                        tooltip: 'Edit',
                    }
                ]
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                align: 'center',
                todo: 'delete',
                items: [
                    {
                        xtype: 'button',
                        icon: 'img/icons/essential/png/trash.png',
                        iconCls: 'icon-bg',
                        tooltip: 'Delete'
                    }
                ]
            }
        ];
        let navigation = {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    icon: 'img/icons/essential/png/add-1.png',
                    iconCls: 'icon-bg',
                    text: 'New',
                    todo: 'add',
                    tooltip: 'Add new',
                },
                {
                    xtype: 'button',
                    icon: 'img/icons/essential/png/trash.png',
                    iconCls: 'icon-bg',
                    text: 'Delete',
                    todo: 'delete',
                    tooltip: 'Delete selection',
                },
                {
                    xtype: 'button',
                    icon: 'img/icons/essential/png/save.png',
                    iconCls: 'icon-bg',
                    text: 'Save',
                    todo: 'save',
                    tooltip: 'Save selection',
                },
                '->',
                {
                    xtype: 'checkboxlistcombo',
                    displayField: 'value',
                    valueField: 'key',
                    editable: false,
                    fieldLabel: 'Search by ',
                    labelWidth: 70,
                    multiSelect: true,
                    firstItemChecksAll: true
                },
                {
                    xtype: 'textfield',
                    text: 'Search value',
                    todo: 'valueFilter',
                    width: 256,
                    tooltip: 'Value filter',
                }
            ]
        };

        this.stores = {
            Type, Brand, Parent, Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax, Status,
            ProductInfo
        };
        Ext.apply(this, {
            items: [
                Ext.create('A.view.master.ProductWindow'),
                Ext.create('Ext.grid.Panel', {
                    loadMask: true,
                    selModel: {
                        selType: 'checkboxmodel', //'Ext.selection.CheckboxModel'
                        checkOnly: true,
                        mode: 'MULTI'
                    },
                    store: ProductInfo,
                    columns: columns,
                    plugins: [
                        {
                            ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                            clicksToEdit: 1
                        }
                    ],
                    viewConfig: {trackOver: false, stripeRows: true},
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: ProductInfo,
                            dock: 'bottom',
                            displayInfo: true,
                            displayMsg: 'Displaying data {0} - {1} of {2}',
                            emptyMsg: 'No data to display',
                            inputItemWidth: 50
                        },
                        navigation
                    ]
                })
            ]
        });
        this.callParent(arguments);
    }
});