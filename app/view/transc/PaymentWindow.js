Ext.define('A.view.transc.PaymentWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentWindow',
    closeAction: 'hide',
    closable: true,
    resizable: true,
    draggable: true,
    width: 750,
    height: 400,
    layout: 'border',
    title: "Payment #XYZ",
    defaults: {
        margins: 0,
        layout: 'fit',
        //loadMask: true,
        //viewConfig: {trackOver: false, stripeRows: true},
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
        let {
            Actor
        } = this.stores;

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
                    xtype: 'panel',
                    flex: 1,
                    layout: 'border',
                    items: [
                        {
                            region: 'center',
                            xtype: 'grid',
                            prop: 'salesdetail',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {name: '#', type: 'auto'},
                                    {name: 'id', type: 'int'},
                                    {name: 'modifier_id', type: 'auto'},
                                    {name: 'modifier_name', type: 'string'},
                                    {name: 'transItem_id', type: 'auto'},
                                    {
                                        name: 'product_name', type: 'string',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return '&mdash; ' + rec.get('modifier_name');
                                            return val;
                                        }
                                    },
                                    {name: 'qty', type: 'float'},
                                    {name: 'qtyy', type: 'float'},
                                    {
                                        name: 'productPrice_price', type: 'float',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return '';
                                            return val;
                                        }
                                    },
                                    {name: 'unit_id', type: 'int'},
                                    {
                                        name: 'unit_name', type: 'string',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return '';
                                            return val;
                                        }
                                    },
                                    {
                                        name: 'disc', type: 'float',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return '';
                                            return val;
                                        }
                                    },
                                    {
                                        name: 'tax', type: 'float',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return '';
                                            return val;
                                        }
                                    },
                                    {
                                        name: 'total', type: 'float',
                                        convert: function (val, rec) {
                                            if (rec.get('modifier_id')) return -val;
                                            return val;
                                        }
                                    },
                                    {name: 'notes', type: 'string'},
                                    {name: 'trans_id', type: 'int'},
                                    {name: 'person_id', type: 'int'}
                                ]
                            }),
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
                                    renderer: Ext.util.Format.numberRenderer('0,000.00')
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
                                        let iFalse = 'img/icons/essential/png/error.png';
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
                                            icon: 'img/icons/essential/png/error.png',
                                            iconCls: 'icon-bg',
                                            text: 'Remove',
                                            todo: 'remove',
                                            tooltip: 'Remove payment',
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