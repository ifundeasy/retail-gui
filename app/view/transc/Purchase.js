Ext.require([
    'A.model.Actor',
    'A.model.Code',
    'A.model.Type',
    'A.model.Trans',
    'A.model.TransItem',
    'A.model.TransItemDisc',
    'A.model.TransItemTax',
    'A.model.TransPayment',
    'A.soap.Product',
    'A.soap.Transaction',
    'A.soap.TransactionItem'
]);
Ext.define('A.view.transc.Purchase', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.transcpurchase',
    flex: 1,
    stores: {},
    initComponent: function () {
        let {currency} = A.app;
        let Actor = Ext.create('A.store.Rest', {model: 'A.model.Actor'});
        let Code = Ext.create('A.store.Rest', {model: 'A.model.Code'});
        let Type = Ext.create('A.store.Rest', {model: 'A.model.Type'});
        let Trans = Ext.create('A.store.Rest', {model: 'A.model.Trans'});
        let TransItem = Ext.create('A.store.Rest', {model: 'A.model.TransItem'});
        let TransItemDisc = Ext.create('A.store.Rest', {model: 'A.model.TransItemDisc'});
        let TransItemTax = Ext.create('A.store.Rest', {model: 'A.model.TransItemTax'});
        let TransPayment = Ext.create('A.store.Rest', {model: 'A.model.TransPayment'});
        //
        let SProduct = Ext.create('A.store.Rest', {model: 'A.soap.Product'});
        let STransaction = Ext.create('A.store.Rest', {model: 'A.soap.Transaction'});
        let STransactionItem = Ext.create('A.store.Rest', {model: 'A.soap.TransactionItem', pageSize: 200});
        let stores = {
            Actor, Code, Type, Trans, TransItem, TransItemDisc,
            TransItemTax, TransPayment,
            //
            SProduct, STransaction, STransactionItem
        };
        let purchasePayWindow = Ext.create('A.view.transc.PurchasePayWindow', {stores});
        let purchaseModWindow = Ext.create('A.view.transc.PurchaseModWindow', {stores});
        let purchaseUnitWindow = Ext.create('A.view.transc.PurchaseUnitWindow', {stores});

        this.stores = stores;

        Ext.apply(this, {
            items: [
                purchaseUnitWindow, purchaseModWindow, purchasePayWindow,
                //
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
                            prop: 'purchasemaster',
                            store: STransaction,
                            viewConfig: {trackOver: false, stripeRows: true},
                            plugins: [
                                {
                                    ptype: 'rowexpander',
                                    rowBodyTpl: new Ext.XTemplate(
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
                                    //renderer: Ext.util.Format.numberRenderer('0,000.00')
                                    xtype: 'numbercolumn',
                                    format: A.app.intSeparator
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'pagingtoolbar',
                                    store: STransaction,
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
                                            tooltip: 'New purchase transaction',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Products',
                            region: 'center',
                            flex: 1,
                            xtype: 'grid',
                            prop: 'purchasedetail',
                            plugins: [
                                {
                                    ptype: 'rowexpander',
                                    rowBodyTpl: new Ext.XTemplate(
                                        '<p class="row-body-tpl"><b>Modified:</b> {info}</p>',
                                        '<p class="row-body-tpl"><b>Discounts:</b> {disc2}</p>',
                                        '<p class="row-body-tpl"><b>Taxes:</b> {tax2}</p>',
                                    )
                                }
                            ],
                            store: Ext.create('Ext.data.Store', {model: 'A.soap.TransactionItem'}),
                            viewConfig: {trackOver: false, stripeRows: true},
                            columns: [
                                {
                                    dataIndex: 'no',
                                    align: 'right',
                                    minWidth: 20,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Code',
                                    dataIndex: 'productCode_code',
                                    minWidth: 75,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Name',
                                    dataIndex: 'product_name',
                                    minWidth: 100,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Price',
                                    dataIndex: 'productPrice_price',
                                    align: 'right',
                                    minWidth: 70,
                                    autoSizeColumn: true,
                                    xtype: 'numbercolumn',
                                    format: A.app.intSeparator
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
                                    text: 'Nett',
                                    dataIndex: 'nett',
                                    align: 'right',
                                    minWidth: 70,
                                    autoSizeColumn: true,
                                    xtype: 'numbercolumn',
                                    format: A.app.intSeparator
                                },
                                {
                                    text: 'Unit',
                                    dataIndex: 'unit_name',
                                    minWidth: 70,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Notes', dataIndex: 'notes'
                                },
                                {
                                    todo: 'misc',
                                    width: 55,
                                    renderer: function (val, e, d, x, y, store) {
                                        let img = '<img style="width: 15px;" src="img/icons/essential/png/settings-4.png"/>';
                                        return store.parent.get('isdone') ? img : '';
                                    }
                                },
                                {
                                    todo: 'delete',
                                    width: 55,
                                    renderer: function (val, e, d, x, y, store) {
                                        let img = '<img style="width: 15px;" src="img/icons/essential/png/trash.png"/>';
                                        return store.parent.get('isdone') ? '' : img;
                                    }
                                }
                            ],
                            selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
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
                                        {
                                            hidden: true,
                                            todo: 'valueFilter',
                                            fieldLabel: 'Query :',
                                            labelWidth: 50,
                                            labelSeparator: '',
                                            typeAhead: false,
                                            autoSelect: false,
                                            tooltip: 'Value filter',
                                            xtype: 'suggestbox',
                                            valueField: 'productCode_code',
                                            displayField: 'name',
                                            store: SProduct,
                                            pageSize: 20,
                                            growMin: 323,
                                            maxWidth: 350
                                        },
                                        {
                                            hidden: true,
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/add-1.png',
                                            iconCls: 'icon-bg',
                                            text: 'Add',
                                            todo: 'add',
                                            tooltip: 'Add product',
                                        },
                                        '->',
                                        {
                                            hidden: true,
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/trash.png',
                                            iconCls: 'icon-bg',
                                            text: 'Delete',
                                            todo: 'delete',
                                            tooltip: 'Delete product'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })
            ]
        });
        this.callParent(arguments);
    }
});