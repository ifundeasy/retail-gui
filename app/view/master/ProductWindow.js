Ext.define('A.view.master.ProductWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.productWindow',
    closeAction: 'hide',
    closable: true,
    resizable: true,
    draggable: true,
    width: 600,
    height: 400,
    layout: {type: 'vbox', align: 'stretch'},
    buttons: [
        {action: 'prev', text: 'Prev'},
        {action: 'next', text: 'Next'},
        '->',
        {action: 'close', text: 'Close'},
        {action: 'save', text: 'Save'}
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {moneyStep} = A.app;
        let {
            Type, Brand, Parent, Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax, Status,
            ProductInfo, Tag, Unit, Tax, Discount
        } = this.stores;

        Ext.apply(this, {
            items: [
                {
                    xtype: 'panel',
                    width: '100%',
                    bodyPadding: 10,
                    layout: 'hbox',
                    defaultType: 'fieldset',
                    defaults: {
                        border: false,
                        margin: '0 5 0 5',
                        padding: '5 0 0 0',
                        layout: 'anchor',
                        anchor: '100%'
                    },
                    items: [
                        {
                            width: '33.3%',
                            defaultType: 'textfield',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 50,
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    fieldLabel: 'ID',
                                    name: 'id',
                                    emptyText: 'Auto generated',
                                    readOnly: true
                                },
                                {
                                    fieldLabel: 'Parent',
                                    name: 'product_id',
                                    xtype: 'suggestbox',
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: Parent
                                }
                            ]
                        },
                        {
                            defaultType: 'textfield',
                            width: '33.3%',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 50,
                                labelSeparator: ''
                            },
                            items: [,
                                {
                                    fieldLabel: 'Brand',
                                    name: 'brand_id',
                                    allowBlank: false,
                                    xtype: 'suggestbox',
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: Brand
                                },
                                {
                                    fieldLabel: 'Name',
                                    name: 'name',
                                    allowBlank: false,
                                    selectOnFocus: true
                                },
                            ]
                        },
                        {
                            defaultType: 'textfield',
                            width: '33.3%',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 50,
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    fieldLabel: 'Status',
                                    name: 'status_id',
                                    allowBlank: false,
                                    xtype: 'suggestbox',
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: Status
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    padding: '0 10 10 10',
                    flex: 1,
                    tabPosition: 'left',
                    items: [
                        {
                            title: 'Code & Tags',
                            xtype: 'panel',
                            autoScroll: true,
                            defaultType: 'grid',
                            layout: {type: 'hbox', align: 'stretch'},
                            flex: 1,
                            defaults: {
                                border: true,
                                loadMask: true,
                                width: '100%',
                                flex: 1,
                                selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                                plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                                viewConfig: {trackOver: false, stripeRows: true},
                            },
                            items: [
                                {
                                    store: ProductCode,
                                    columns: [
                                        {
                                            text: 'ID',
                                            dataIndex: 'id',
                                            minWidth: 60,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Code',
                                            dataIndex: 'code',
                                            minWidth: 100,
                                            autoSizeColumn: true,
                                            editor: {xtype: 'textfield'}
                                        },
                                        {
                                            text: 'Notes', dataIndex: 'notes',
                                            editor: {xtype: 'textfield'}
                                        }
                                    ],
                                    margin: '0 5 0 10',
                                    dockedItems: [
                                        {
                                            xtype: 'pagingtoolbar',
                                            store: ProductCode,
                                            dock: 'bottom',
                                            displayInfo: true,
                                            displayMsg: 'Displaying data {0} - {1} of {2}',
                                            emptyMsg: 'No data to display',
                                            inputItemWidth: 50
                                        },
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            style: {backgroundColor: 'rgba(173, 211, 238, 0.47);'},
                                            items: [
                                                {
                                                    xtype: 'component',
                                                    html: 'Code',
                                                    style: {fontWeight: 'bolder'}
                                                },
                                                '->',
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
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    store: ProductTag,
                                    margin: '0 0 0 5',
                                    columns: [
                                        {
                                            text: 'ID',
                                            dataIndex: 'id',
                                            minWidth: 60,
                                            autoSizeColumn: true
                                        },
                                        {
                                            text: 'Name',
                                            dataIndex: 'tag_id',
                                            minWidth: 100,
                                            autoSizeColumn: true,
                                            renderer: function (val, meta, record, rowIndex) {
                                                if (!record.dirty) return record.data.tag_name || '';
                                                let idx = Tag.findExact('id', val);
                                                return (idx === -1) ? '' : Tag.getAt(idx).get('name');
                                            },
                                            editor: {
                                                xtype: 'suggestbox',
                                                displayField: 'name',
                                                valueField: 'id',
                                                editable: false,
                                                store: Tag
                                            }
                                        },
                                        {
                                            text: 'Notes', dataIndex: 'notes',
                                            editor: {xtype: 'textfield'}
                                        }
                                    ],
                                    dockedItems: [
                                        {
                                            xtype: 'pagingtoolbar',
                                            store: ProductTag,
                                            dock: 'bottom',
                                            displayInfo: true,
                                            displayMsg: 'Displaying data {0} - {1} of {2}',
                                            emptyMsg: 'No data to display',
                                            inputItemWidth: 50
                                        },
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            style: {backgroundColor: 'rgba(173, 211, 238, 0.47);'},
                                            items: [
                                                {
                                                    xtype: 'component',
                                                    html: 'Tags',
                                                    style: {fontWeight: 'bolder'}
                                                },
                                                '->',
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
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Prices',
                            xtype: 'panel',
                            border: false,
                            layout: {type: 'hbox', align: 'stretch'},
                            items: [
                                {
                                    width: '50%',
                                    margin: '0 10 0 10',
                                    defaultType: 'grid',
                                    height: '100%',
                                    defaults: {
                                        border: true,
                                        loadMask: true,
                                        width: '100%',
                                        flex: 1,
                                        margin: 0
                                    },
                                    layout: {type: 'fit', align: 'stretch'},
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'grid',
                                            prop: 'productPrice',
                                            store: ProductPrice,
                                            columns: [
                                                {
                                                    text: 'ID',
                                                    dataIndex: 'id',
                                                    minWidth: 60,
                                                    autoSizeColumn: true
                                                },
                                                {
                                                    text: 'Code',
                                                    dataIndex: 'productCode_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        if (!record.dirty) return record.data.productCode_code || '';
                                                        let idx = ProductCode.findExact('id', val);
                                                        return (idx === -1) ? '' : ProductCode.getAt(idx).get('code');
                                                    },
                                                    editor: {
                                                        xtype: 'suggestbox',
                                                        displayField: 'code',
                                                        valueField: 'id',
                                                        editable: false,
                                                        store: ProductCode
                                                    }
                                                },
                                                {
                                                    text: 'Price',
                                                    dataIndex: 'price',
                                                    xtype: 'numbercolumn',
                                                    format: ',0.00',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    align: 'right',
                                                    editor: {
                                                        xtype: 'numberfield',
                                                        step: moneyStep,
                                                        minValue: 0,
                                                        fieldStyle: 'text-align:right;'
                                                    }
                                                },
                                                {
                                                    text: 'Type',
                                                    dataIndex: 'type_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        if (!record.dirty) return record.data.type_name || '';
                                                        let idx = Type.findExact('id', val);
                                                        return (idx === -1) ? '' : Type.getAt(idx).get('name');
                                                    },
                                                    editor: {
                                                        xtype: 'suggestbox',
                                                        displayField: 'name',
                                                        valueField: 'id',
                                                        editable: false,
                                                        store: Type
                                                    }
                                                },
                                                {
                                                    text: 'Unit',
                                                    dataIndex: 'unit_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        if (!record.dirty) return record.data.unit_name || '';
                                                        let idx = Unit.findExact('id', val);
                                                        return (idx === -1) ? '' : Unit.getAt(idx).get('name');
                                                    },
                                                    editor: {
                                                        xtype: 'suggestbox',
                                                        displayField: 'name',
                                                        valueField: 'id',
                                                        editable: false,
                                                        store: Unit
                                                    }
                                                },
                                                {
                                                    text: 'Notes', dataIndex: 'notes',
                                                    editor: {xtype: 'textfield'}
                                                }
                                            ],
                                            selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                                            plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                                            viewConfig: {trackOver: false, stripeRows: true},
                                            dockedItems: [
                                                {
                                                    xtype: 'pagingtoolbar',
                                                    store: ProductPrice,
                                                    dock: 'bottom',
                                                    displayInfo: true,
                                                    displayMsg: 'Displaying data {0} - {1} of {2}',
                                                    emptyMsg: 'No data to display',
                                                    inputItemWidth: 50
                                                },
                                                {
                                                    xtype: 'toolbar',
                                                    dock: 'top',
                                                    style: {backgroundColor: 'rgba(173, 211, 238, 0.47);'},
                                                    items: [
                                                        {
                                                            xtype: 'component',
                                                            html: 'Prices',
                                                            style: {fontWeight: 'bolder'}
                                                        },
                                                        '->',
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
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    width: '50%',
                                    layout: 'vbox',
                                    defaultType: 'grid',
                                    defaults: {
                                        border: true,
                                        loadMask: true,
                                        width: '100%',
                                        flex: 1,
                                        selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                                        plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                                        viewConfig: {trackOver: false, stripeRows: true},
                                    },
                                    items: [
                                        {
                                            xtype: 'grid',
                                            store: ProductPriceTax,
                                            margin: '0 1 10 0',
                                            columns: [
                                                {
                                                    text: 'PriceID',
                                                    dataIndex: 'productPrice_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true
                                                },
                                                {
                                                    text: 'Name',
                                                    dataIndex: 'tax_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        if (!record.dirty) return record.data.tax_name || '';
                                                        let idx = Tax.findExact('id', val);
                                                        return (idx === -1) ? '' : Tax.getAt(idx).get('name');
                                                    },
                                                    editor: {
                                                        xtype: 'suggestbox',
                                                        displayField: 'name',
                                                        valueField: 'id',
                                                        editable: false,
                                                        store: Tax
                                                    }
                                                },
                                                {
                                                    text: 'Value',
                                                    align: 'right',
                                                    dataIndex: 'tax_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        let idx = Tax.findExact('id', val);
                                                        if (idx === -1) return '';
                                                        let isPercent = Tax.getAt(idx).get('isPercent');
                                                        let value = Ext.util.Format.number(Tax.getAt(idx).get('value'), ',0.00');
                                                        if (isPercent === '1') return '% ' + value;
                                                        return value
                                                    }
                                                },
                                                {
                                                    text: 'Notes', dataIndex: 'notes',
                                                    editor: {xtype: 'textfield'}
                                                }
                                            ],
                                            dockedItems: [
                                                {
                                                    xtype: 'pagingtoolbar',
                                                    store: ProductPriceTax,
                                                    dock: 'bottom',
                                                    displayInfo: true,
                                                    displayMsg: 'Displaying data {0} - {1} of {2}',
                                                    emptyMsg: 'No data to display',
                                                    inputItemWidth: 50
                                                },
                                                {
                                                    xtype: 'toolbar',
                                                    dock: 'top',
                                                    style: {backgroundColor: 'rgba(173, 211, 238, 0.47);'},
                                                    items: [
                                                        {
                                                            xtype: 'component',
                                                            html: 'Taxes',
                                                            style: {fontWeight: 'bolder'}
                                                        },
                                                        '->',
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
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'grid',
                                            store: ProductPriceDisc,
                                            margin: '0 1 0 0',
                                            columns: [
                                                {
                                                    text: 'PriceID',
                                                    dataIndex: 'productPrice_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true
                                                },
                                                {
                                                    text: 'Name',
                                                    dataIndex: 'discount_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        if (!record.dirty) return record.data.discount_name || '';
                                                        let idx = Discount.findExact('id', val);
                                                        return (idx === -1) ? '' : Discount.getAt(idx).get('name');
                                                    },
                                                    editor: {
                                                        xtype: 'suggestbox',
                                                        displayField: 'name',
                                                        valueField: 'id',
                                                        editable: false,
                                                        store: Discount
                                                    }
                                                },
                                                {
                                                    text: 'Value',
                                                    align: 'right',
                                                    dataIndex: 'discount_id',
                                                    minWidth: 100,
                                                    autoSizeColumn: true,
                                                    renderer: function (val, meta, record, rowIndex) {
                                                        let idx = Discount.findExact('id', val);
                                                        if (idx === -1) return '';
                                                        let isPercent = Discount.getAt(idx).get('isPercent');
                                                        let value = Ext.util.Format.number(Discount.getAt(idx).get('value'), ',0.00');
                                                        if (isPercent === '1') return '(%) ' + value;
                                                        return value
                                                    }
                                                },
                                                {
                                                    text: 'Notes', dataIndex: 'notes',
                                                    editor: {xtype: 'textfield'}
                                                }
                                            ],
                                            dockedItems: [
                                                {
                                                    xtype: 'pagingtoolbar',
                                                    store: ProductPriceDisc,
                                                    dock: 'bottom',
                                                    displayInfo: true,
                                                    displayMsg: 'Displaying data {0} - {1} of {2}',
                                                    emptyMsg: 'No data to display',
                                                    inputItemWidth: 50
                                                },
                                                {
                                                    xtype: 'toolbar',
                                                    dock: 'top',
                                                    style: {backgroundColor: 'rgba(173, 211, 238, 0.47);'},
                                                    items: [
                                                        {
                                                            xtype: 'component',
                                                            html: 'Discounts',
                                                            style: {fontWeight: 'bolder'}
                                                        },
                                                        '->',
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
                                                        }
                                                    ]
                                                }
                                            ]
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
