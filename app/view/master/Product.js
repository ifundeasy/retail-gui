Ext.require([
    'A.model.Brand',
    'A.model.Product',
    'A.model.ProductCode',
    'A.model.ProductTag',
    'A.model.ProductPrice',
    'A.model.ProductPriceDisc',
    'A.model.ProductPriceTax',
    'A.model.Status'
]);
Ext.define('A.view.master.Product', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterProduct',
    initComponent: function () {
        let Brand = Ext.create('A.store.Rest', {model: 'A.model.Brand'});
        let Parent = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let Product = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let ProductCode = Ext.create('A.store.Rest', {model: 'A.model.ProductCode'});
        let ProductTag = Ext.create('A.store.Rest', {model: 'A.model.ProductTag'});
        let ProductPrice = Ext.create('A.store.Rest', {model: 'A.model.ProductPrice'});
        let ProductPriceDisc = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceDisc'});
        let ProductPriceTax = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceTax'});
        let Status = Ext.create('A.store.Rest', {model: 'A.model.Status'});
        //
        let columns = [
            //new Ext.grid.RowNumberer(),
            {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
            {
                text: 'Name',
                dataIndex: 'name',
                minWidth: 100,
                autoSizeColumn: true,
                editor: {xtype: 'textfield'}
            },
            {
                text: 'Brand',
                dataIndex: 'brand_id',
                minWidth: 100,
                autoSizeColumn: true,
                renderer: function (val, meta, record, rowIndex) {
                    if (!record.dirty) return record.data.brand_name || '';
                    let idx = Parent.findExact('id', val);
                    return (idx === -1) ? '' : Parent.getAt(idx).get('name');
                },
                editor: {
                    xtype: 'suggestbox',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    store: Brand
                }
            },
            {
                text: 'Parent',
                dataIndex: 'product_id',
                minWidth: 100,
                autoSizeColumn: true,
                renderer: function (val, meta, record, rowIndex) {
                    if (!record.dirty) return record.data.product_name || '';
                    let idx = Parent.findExact('id', val);
                    return (idx === -1) ? '' : Parent.getAt(idx).get('name');
                },
                editor: {
                    xtype: 'suggestbox',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    store: Parent
                }
            },
            {
                text: 'Status',
                dataIndex: 'status_id',
                minWidth: 100,
                autoSizeColumn: true,
                renderer: function (val, meta, record, rowIndex) {
                    if (!record.dirty) return record.data.status_name || '';
                    let idx = Status.findExact('id', val);
                    return (idx === -1) ? '' : Status.getAt(idx).get('name');
                },
                editor: {
                    xtype: 'suggestbox',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    store: Status
                }
            },
            {
                text: 'Notes', dataIndex: 'notes', flex: 1,
                editor: {xtype: 'textfield'}
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
        let grid = {
            xtype: 'grid',
            loadMask: true,
            selModel: {
                selType: 'checkboxmodel', //'Ext.selection.CheckboxModel'
                checkOnly: true,
                mode: 'MULTI'
            },
            store: Product,
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
                    store: Product,
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg: 'Displaying data {0} - {1} of {2}',
                    emptyMsg: 'No data to display',
                    inputItemWidth: 50
                },
                navigation
            ]
        };
        Ext.apply(this, {
            items: [grid]
        });

        this.callParent(arguments);
    }
});