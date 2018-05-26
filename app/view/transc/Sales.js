Ext.require([
    'A.model.Actor',
    'A.model.Status',
    'A.model.Tag',
    'A.model.Unit',
    'A.model.Tax',
    'A.model.Discount',
    'A.model.Type',
    'A.model.Modifier',
    'A.model.Brand',
    'A.model.Product',
    'A.model.ProductCode',
    'A.model.ProductTag',
    'A.model.ProductPrice',
    'A.model.ProductPriceDisc',
    'A.model.ProductPriceTax',
    'A.model.TransItem',
    'A.soap.Product',
    'A.soap.Transaction',
    'A.soap.TransactionItem'
]);
Ext.define('A.view.transc.Sales', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.transcsales',
    //layout: 'hbox',
    flex: 1,
    stores: {},
    initComponent: function () {
        let {currency} = A.app;
        let Actor = Ext.create('A.store.Rest', {model: 'A.model.Actor'});
        let Type = Ext.create('A.store.Rest', {model: 'A.model.Type'});
        let Modifier = Ext.create('A.store.Rest', {model: 'A.model.Modifier'});
        let Brand = Ext.create('A.store.Rest', {model: 'A.model.Brand'});
        let Parent = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let Product = Ext.create('A.store.Rest', {model: 'A.model.Product'});
        let ProductCode = Ext.create('A.store.Rest', {model: 'A.model.ProductCode', pageSize: 10});
        let ProductTag = Ext.create('A.store.Rest', {model: 'A.model.ProductTag', pageSize: 10});
        let ProductPrice = Ext.create('A.store.Rest', {model: 'A.model.ProductPrice'});
        let ProductPriceDisc = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceDisc', pageSize: 3});
        let ProductPriceTax = Ext.create('A.store.Rest', {model: 'A.model.ProductPriceTax', pageSize: 3});
        let Status = Ext.create('A.store.Rest', {model: 'A.model.Status'});
        let Tag = Ext.create('A.store.Rest', {model: 'A.model.Tag'});
        let Unit = Ext.create('A.store.Rest', {model: 'A.model.Unit'});
        let Tax = Ext.create('A.store.Rest', {model: 'A.model.Tax'});
        let Discount = Ext.create('A.store.Rest', {model: 'A.model.Discount'});
        let ProductInfo = Ext.create('A.store.Rest', {model: 'A.soap.Product'});
        let Transaction = Ext.create('A.store.Rest', {model: 'A.soap.Transaction'});
        let TransactionItem = Ext.create('A.store.Rest', {model: 'A.soap.TransactionItem', pageSize: 200});
        let TransItem = Ext.create('A.store.Rest', {model: 'A.model.TransItem'});
        let stores = {
            Actor, Type, Brand, Parent, Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax, Status,
            Tag, Unit, Tax, Discount, ProductInfo,
            Transaction, TransactionItem, TransItem
        };
        let paymentWindow = Ext.create('A.view.transc.PaymentWindow', {stores});

        this.stores = stores;
        Ext.apply(this, {
            items: [
                paymentWindow,
                Ext.create('Ext.panel.Panel', {
                    layout: 'border',
                    defaults: {
                        margins: 0,
                        loadMask: true,
                        layout: 'fit'
                    },
                    items: [
                        {
                            title: 'Transaction',
                            region: 'west',
                            xtype: 'grid',
                            width: 220,
                            split: true,
                            collapsible: true,
                            titleCollapse: true,
                            //
                            prop: 'salesmaster',
                            store: Transaction,
                            viewConfig: {trackOver: false, stripeRows: true},
                            plugins: [
                                {
                                    ptype: 'rowexpander',
                                    rowBodyTpl : new Ext.XTemplate(
                                        '<p class="row-body-tpl"><b>{code}</b></p>',
                                        '<p class="row-body-tpl"><b>Operator:</b> {person_name}</p>',
                                        '<p class="row-body-tpl"><b>Customer:</b> {subject_name}</p>',
                                        '<p class="row-body-tpl"><b>Items&nbsp;&nbsp;&nbsp;:</b> {numofprod}</p>',
                                        '<p class="row-body-tpl"><b>Finished:</b> {isdone}</p>',
                                        '<p class="row-body-tpl"><b>Paid Off:</b> {paidoff}</p>',
                                        '<p class="row-body-tpl"><b>* Balance:</b> {balance * -1}</p>',
                                        '<p class="row-body-tpl"><b>* Change&nbsp;:</b> {change}</p>'
                                    )
                                }
                            ],
                            columns: [
                                {
                                    width: 35,
                                    sortable: false,
                                    renderer: function (val, e, d) {
                                        let ok = 'img/icons/essential/png/green.png';
                                        let warn = 'img/icons/essential/png/yellow.png';
                                        let fail = 'img/icons/essential/png/red.png';
                                        let isdone = d.get('isdone');
                                        let paidoff = d.get('paidoff');
                                        let is = fail;
                                        if (isdone && paidoff) {
                                            is = ok;
                                        } else if (isdone || paidoff) {
                                            is = warn;
                                        }

                                        return `<img style="width:15px;" src="${is}"/>`;
                                    }
                                },
                                {
                                    text: 'Time',
                                    dataIndex: 'dc',
                                    align: 'center',
                                    minWidth: 70,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Total',
                                    dataIndex: 'total',
                                    align: 'right',
                                    minWidth: 50,
                                    autoSizeColumn: true,
                                    renderer: Ext.util.Format.numberRenderer('0,000.00')
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'pagingtoolbar',
                                    store: Transaction,
                                    dock: 'bottom',
                                    displayInfo: false,
                                    inputItemWidth: 50
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/interaction/png/list.png',
                                            iconCls: 'icon-bg',
                                            text: 'New',
                                            todo: 'add',
                                            tooltip: 'New sales transaction',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Products',
                            region: 'center',
                            xtype: 'panel',
                            flex: 1,
                            layout: 'border',
                            items: [
                                {
                                    region: 'center',
                                    xtype: 'grid',
                                    prop: 'salesdetail',
                                    plugins: [
                                        {
                                            ptype: 'rowexpander',
                                            rowBodyTpl : new Ext.XTemplate(
                                                '<p class="row-body-tpl"><b>Taxes:</b> {tax}</p>',
                                                '<p class="row-body-tpl"><b>Discounts:</b> {disc}</p>',
                                                '<p class="row-body-tpl"><b>Info:</b> {info}</p>'
                                            )
                                        }
                                    ],
                                    store: Ext.create('Ext.data.Store', { model: 'A.soap.TransactionItem' }),
                                    viewConfig: {trackOver: false, stripeRows: true},
                                    columns: [
                                        {
                                            dataIndex: 'no',
                                            align: 'right',
                                            minWidth: 20,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Name',
                                            dataIndex: 'product_name',
                                            minWidth: 100,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Q',
                                            dataIndex: 'qty',
                                            align: 'right',
                                            minWidth: 35,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'X',
                                            dataIndex: 'qties',
                                            align: 'right',
                                            minWidth: 35,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Unit',
                                            dataIndex: 'unit_name',
                                            minWidth: 70,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Price',
                                            dataIndex: 'productPrice_price',
                                            align: 'right',
                                            minWidth: 70,
                                            autoSizeColumn: true,
                                            renderer: Ext.util.Format.numberRenderer('0,000.00')
                                        },
                                        {
                                            text: 'Nett',
                                            dataIndex: 'nett',
                                            align: 'right',
                                            minWidth: 70,
                                            autoSizeColumn: true,
                                            renderer: Ext.util.Format.numberRenderer('0,000.00')
                                        },
                                        {
                                            text: 'Notes', dataIndex: 'notes'
                                        },
                                        {
                                            todo: 'action',
                                            width: 55,
                                            renderer: function (val, e, d, x, y, store) {
                                                return store.parent.get('isdone') ?  '' : '<img style="width: 15px;" src="img/icons/essential/png/error.png"/>';
                                            }
                                        },
                                    ],
                                    //selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'bottom',
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    todo: 'totalitems',
                                                    text: '0'
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: 'Items'
                                                },
                                                '-',
                                                {
                                                    xtype: 'label',
                                                    prefix: currency + ' ',
                                                    text: currency + ' 0.00',
                                                    todo: 'totalmoney',
                                                },
                                                '->',
                                                {
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/price-tag.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Payment',
                                                    todo: 'payment',
                                                    tooltip: 'Show payment section'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            height: 36,
                                            items: [
                                                /*{
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/paper-plane-1.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Void',
                                                    todo: 'void',
                                                    tooltip: 'Flag product to void'
                                                },
                                                {
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/like-1.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Bonus',
                                                    todo: 'bonus',
                                                    tooltip: 'Flag product to bonus',
                                                },
                                                {
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/notification.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Compl.',
                                                    todo: 'complimentary',
                                                    tooltip: 'Flag product to complimentary'
                                                },
                                                {
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/pin.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Sample',
                                                    todo: 'sample',
                                                    tooltip: 'Flag product to sample'
                                                },*/
                                                {
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/error.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Remove',
                                                    todo: 'remove',
                                                    tooltip: 'Remove product'
                                                },
                                                '->',
                                                {
                                                    hidden: true,
                                                    xtype: 'textfield',
                                                    text: 'Search value',
                                                    todo: 'valueFilter',
                                                    width: 256,
                                                    tooltip: 'Value filter',
                                                },
                                                {
                                                    hidden: true,
                                                    xtype: 'button',
                                                    icon: 'img/icons/essential/png/add-1.png',
                                                    iconCls: 'icon-bg',
                                                    text: 'Add',
                                                    todo: 'add',
                                                    tooltip: 'Add product',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Modify',
                            region: 'east',
                            xtype: 'grid',
                            width: 190,
                            split: true,
                            collapsible: true,
                            titleCollapse: true,
                            //
                            prop: 'salesinfo',
                            store: TransItem,
                            viewConfig: {trackOver: false, stripeRows: true},
                            plugins: [
                                {
                                    ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                                    clicksToEdit: 1
                                }
                            ],
                            columns: [
                                {
                                    text: 'Name',
                                    dataIndex: 'modifier_id',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.modifier_name || '';
                                        let idx = Modifier.findExact('id', val);
                                        return (idx === -1) ? '' : Modifier.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'combobox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        store: Modifier
                                    }
                                },
                                {
                                    text: 'Q',
                                    dataIndex: 'qty',
                                    align: 'right',
                                    minWidth: 55,
                                    autoSizeColumn: true,
                                    editor: {
                                        xtype: 'numberfield',
                                        minValue: 0
                                    }
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/interaction/png/list.png',
                                            iconCls: 'icon-bg',
                                            text: 'New',
                                            todo: 'add',
                                            tooltip: 'New sales transaction',
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                })
            ]
        });
        this.callParent(arguments);
    }
});