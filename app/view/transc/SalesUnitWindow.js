Ext.define('A.view.transc.SalesUnitWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.salesUnitWindow',
    closeAction: 'hide',
    closable: true,
    resizable: true,
    draggable: true,
    width: 440,
    height: 300,
    layout: 'border',
    title: '?',
    defaults: {
        margins: 0
    },
    buttons: [
        '->',
        {action: 'close', text: 'Close'},
        {action: 'add', text: 'Add'}
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {moneyStep, currency} = A.app;
        let {Actor, STransaction, STransactionItem} = this.stores;

        Ext.apply(this, {
            items: [
                {
                    region: 'north',
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
                            editable: true,
                            fieldCls: 'right-text-align',
                            labelSeparator: '',
                            labelWidth: 30,
                            fieldLabel: 'Qty',
                            name: 'qty',
                            minValue: 1,
                            maxValue: 1000,
                            value: 1,
                            todo: 'qty'
                        }
                    ]
                },
                {
                    flex: 1,
                    region: 'center',
                    xtype: 'panel',
                    bodyPadding: 5,
                    autoScroll: true,
                    todo: 'buttons',
                    defaults: {
                        xtype: 'button',
                        width: 120,
                        height: 100,
                        margin: 5
                    },
                    items: [
                        /**/
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'label',
                                    todo: 'price',
                                    prefix: currency + ' ',
                                    text: currency + ' 0.00',
                                },
                                {
                                    html: '&ndash;',
                                    cls: 'bold-text',
                                    xtype: 'label'
                                },
                                {
                                    xtype: 'label',
                                    todo: 'discounts',
                                    cls: 'green-text bold-text',
                                    prefix: currency + ' ',
                                    text: currency + ' 0.00',
                                },
                                '->',
                                {
                                    text: 'Nett Price',
                                    xtype: 'label',
                                    cls: 'italic-text'
                                },
                                {
                                    xtype: 'label',
                                    todo: 'nettprice',
                                    cls: 'bold-text',
                                    prefix: currency + ' ',
                                    text: currency + ' 0.00',
                                },
                            ]
                        }
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }
});