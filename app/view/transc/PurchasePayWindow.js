Ext.define('A.view.transc.PurchasePayWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.purchasePayWindow',
    closeAction: 'hide',
    closable: true,
    resizable: true,
    draggable: true,
    width: 750,
    height: 400,
    layout: 'border',
    title: '?',
    defaults: {
        margins: 0,
        layout: 'fit'
    },
    buttons: [
        '->',
        {action: 'close', text: 'Close'},
        {action: 'save', text: 'Save'}
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {moneyStep, currency} = A.app;
        let {Actor, STransaction, STransactionItem} = this.stores;

        Ext.apply(this, {
            items: [
                {
                    title: 'Billing',
                    region: 'west',
                    xtype: 'form',
                    width: 250,
                    split: true,
                    bodyPadding: 10,
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            readOnly: true,
                            editable: false,
                            fieldCls: 'right-text-align',
                            labelSeparator: '',
                            labelWidth: 60,
                            fieldLabel: 'Subtotal',
                            name: 'subtotal'
                        },
                        {
                            xtype: 'numberfield',
                            readOnly: true,
                            editable: false,
                            fieldCls: 'right-text-align',
                            labelSeparator: '',
                            labelWidth: 60,
                            fieldLabel: 'Taxes',
                            name: 'taxes'
                        },
                        {
                            xtype: 'numberfield',
                            readOnly: true,
                            editable: false,
                            fieldCls: 'right-text-align',
                            labelSeparator: '',
                            labelWidth: 60,
                            fieldLabel: 'Discounts',
                            name: 'discounts'
                        },
                        {
                            xtype: 'numberfield',
                            readOnly: true,
                            editable: false,
                            fieldCls: 'right-text-align',
                            labelSeparator: '',
                            labelWidth: 60,
                            fieldLabel: 'Total',
                            name: 'discounts'
                        },
                        {
                            fieldLabel: 'Member',
                            labelSeparator: '',
                            labelWidth: 60,
                            xtype: 'suggestbox',
                            name: 'member',
                            store: Actor,
                            displayField: 'name',
                            valueField: 'id'
                        },
                        {
                            fieldLabel: 'Notes',
                            labelSeparator: '',
                            labelWidth: 60,
                            name: 'notes',
                            xtype: 'textareafield'
                        }
                    ]
                },
                {
                    title: 'Methods',
                    region: 'center',
                    flex: 1,
                    xtype: 'grid',
                    prop: 'payment',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'id', type: 'int'}
                        ]
                    }),
                    loadMask: true,
                    columns: [
                        {
                            text: '#',
                            dataIndex: '#',
                            minWidth: 20,
                            autoSizeColumn: true
                        },
                        {
                            text: 'Type',
                            dataIndex: 'product_name',
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
                            text: 'Other',
                            dataIndex: 'unit_name',
                            minWidth: 70,
                            autoSizeColumn: true
                        },
                        {
                            text: 'Notes',
                            dataIndex: 'productPrice_price',
                            align: 'right',
                            minWidth: 100
                        },
                        {
                            todo: 'action',
                            width: 55,
                            renderer: function (val, e, d, x, y, store) {
                                let is = store.parent.get('isdone');
                                let iTrue = 'img/icons/essential/png/settings-4.png';
                                let iFalse = 'img/icons/essential/png/trash.png';
                                return `<img style="width: 15px;" src="${is ? iTrue : iFalse}"/>`
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
        });
        this.callParent(arguments);
    }
});