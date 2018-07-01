Ext.define('A.view.transc.SalesModWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.salesModWindow',
    closeAction: 'hide',
    closable: true,
    resizable: true,
    draggable: true,
    width: 900,
    height: 600,
    layout: 'border',
    title: '?',
    buttons: [
        '->',
        {action: 'close', text: 'Close'},
        {action: 'save', text: 'Save'}
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {moneyStep, currency} = A.app;
        let {STransaction, STransactionItem} = this.stores;

        Ext.apply(this, {
            items: [
                {
                    title: 'Modify',
                    width: 400,
                    xtype: 'grid',
                    region: 'west',
                    margins: 0,
                    layout: 'fit',
                    autoScroll: true,
                    split: true,
                    prop: 'itemmodifier',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'id', type: 'int'}
                        ]
                    }),
                    columns: [
                        {
                            text: 'Type',
                            dataIndex: 'modifier_id',
                            minWidth: 100,
                            autoSizeColumn: true
                        },
                        {
                            text: 'Value',
                            dataIndex: 'qty',
                            align: 'right',
                            minWidth: 70,
                            autoSizeColumn: true,
                            xtype: 'numbercolumn',
                            format: A.app.intSeparator
                        },
                        {
                            text: 'Notes',
                            dataIndex: 'notes',
                            align: 'right',
                            minWidth: 100
                        },
                        {
                            todo: 'action',
                            width: 55,
                            renderer: function (val, e, d, x, y, store) {
                                return `<img style="width: 15px;" src="img/icons/essential/png/trash.png"/>`
                            }
                        }
                    ],
                    plugins: [
                        {
                            ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                            clicksToEdit: 1
                        }
                    ],
                    selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                    viewConfig: {trackOver: false, stripeRows: true},
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    icon: 'img/icons/essential/png/add-1.png',
                                    iconCls: 'icon-bg',
                                    text: 'Add',
                                    todo: 'add',
                                    tooltip: 'Add payment',
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    icon: 'img/icons/essential/png/trash.png',
                                    iconCls: 'icon-bg',
                                    text: 'Delete',
                                    todo: 'delete',
                                    tooltip: 'Delete payment',
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    defaults: {
                        xtype: 'grid',
                        layout: 'fit',
                        autoScroll: true,
                        split: true
                    },
                    items: [
                        {
                            title: 'Discount',
                            region: 'north',
                            height: '50%',
                            prop: 'itemdiscounts',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {name: 'id', type: 'int'}
                                ]
                            }),
                            columns: [
                                {
                                    text: 'Type',
                                    dataIndex: 'modifier_id',
                                    minWidth: 100,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Value',
                                    dataIndex: 'qty',
                                    align: 'right',
                                    minWidth: 70,
                                    autoSizeColumn: true,
                                    xtype: 'numbercolumn',
                                    format: A.app.intSeparator
                                },
                                {
                                    text: 'Notes',
                                    dataIndex: 'notes',
                                    align: 'right',
                                    minWidth: 100
                                },
                                {
                                    todo: 'action',
                                    width: 55,
                                    renderer: function (val, e, d, x, y, store) {
                                        return `<img style="width: 15px;" src="img/icons/essential/png/trash.png"/>`
                                    }
                                }
                            ],
                            plugins: [
                                {
                                    ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                                    clicksToEdit: 1
                                }
                            ],
                            selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                            viewConfig: {trackOver: false, stripeRows: true},
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/add-1.png',
                                            iconCls: 'icon-bg',
                                            text: 'Add',
                                            todo: 'add',
                                            tooltip: 'Add payment',
                                        },
                                        '->',
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/trash.png',
                                            iconCls: 'icon-bg',
                                            text: 'Delete',
                                            todo: 'delete',
                                            tooltip: 'Delete payment',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Taxes',
                            height: '50%',
                            region: 'center',
                            prop: 'itemtaxes',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {name: 'id', type: 'int'}
                                ]
                            }),
                            columns: [
                                {
                                    text: 'Type',
                                    dataIndex: 'modifier_id',
                                    minWidth: 100,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Value',
                                    dataIndex: 'qty',
                                    align: 'right',
                                    minWidth: 70,
                                    autoSizeColumn: true,
                                    xtype: 'numbercolumn',
                                    format: A.app.intSeparator
                                },
                                {
                                    text: 'Notes',
                                    dataIndex: 'notes',
                                    align: 'right',
                                    minWidth: 100
                                },
                                {
                                    todo: 'action',
                                    width: 55,
                                    renderer: function (val, e, d, x, y, store) {
                                        return `<img style="width: 15px;" src="img/icons/essential/png/trash.png"/>`
                                    }
                                }
                            ],
                            plugins: [
                                {
                                    ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                                    clicksToEdit: 1
                                }
                            ],
                            selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                            viewConfig: {trackOver: false, stripeRows: true},
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/add-1.png',
                                            iconCls: 'icon-bg',
                                            text: 'Add',
                                            todo: 'add',
                                            tooltip: 'Add payment',
                                        },
                                        '->',
                                        {
                                            xtype: 'button',
                                            icon: 'img/icons/essential/png/trash.png',
                                            iconCls: 'icon-bg',
                                            text: 'Delete',
                                            todo: 'delete',
                                            tooltip: 'Delete payment',
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }
});