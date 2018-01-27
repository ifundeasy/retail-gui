Ext.require([
    'A.model.National'
]);
let navigate = function (panel, direction) {
    /*let fn = 'get' + direction[0].toUpperCase() + direction.substr(1);
    let layout = panel.getLayout();
    let prev = layout.getPrev();
    let next = layout.getNext();

    layout.getActiveItem().getEl().fadeOut();
    layout[fn]().getEl().fadeIn();
    layout[direction]();

    Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
    Ext.getCmp('move-next').setDisabled(!layout.getNext());*/
};
Ext.define('A.view.master.ProductWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.productWindow',
    defaultWidth: 600,
    defaultHeight: 400,
    tools: [
        {
            type: 'maximize',
            callback: function (window) {
                let parent = window.up();
                let pos = parent.getPosition();
                let width = parent.getWidth() - 60,
                    height = parent.getHeight() - 60;

                this.hide();
                this.next().show();
                window.setLocalXY(pos[0] + 30, pos[1] + 30, true);
                window.setWidth(width);
                window.setHeight(height);
            }
        },
        {
            type: 'restore',
            hidden: true,
            callback: function (window) {
                let parent = window.up();
                let pos = parent.getPosition();
                let width = parent.getWidth() - window.defaultWidth,
                    height = parent.getHeight() - window.defaultHeight;

                this.hide();
                this.prev().show();
                window.setLocalXY(pos[0] + (width / 2), pos[1] + (height / 2), true);
                window.setWidth(window.defaultWidth);
                window.setHeight(window.defaultHeight);
            }
        }
    ],
    autoScroll : true,
    closable: false,
    resizable: false,
    draggable: false,
    layout: {
        type : 'vbox',
        align : 'stretch'
    },
    buttons: [
        {
            id: 'move-prev',
            action: 'back',
            //text: '&#8592;',
            text: 'Prev',
            handler: function (btn) {
                navigate(btn.up("panel"), "prev");
            },
            disabled: true
        },
        {
            id: 'move-next',
            action: 'next',
            //text: '&#8594;',
            text: 'Next',
            handler: function (btn) {
                navigate(btn.up("panel"), "next");
            }
        },
        '->',
        {
            action: 'save',
            text: 'Save'
        },
        {
            action: 'close',
            text: 'Close',
            handler: function (btn) {
                btn.up('window').hide()
            }
        },
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {
            Type, Brand, Parent, Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax, Status,
            ProductInfo, Tag, Unit, Tax, Discount
        } = this.stores;

        window.stores = this.stores;
        let createGrid = function (title, store, columns) {
            let cols = [
                {
                    text: 'ID',
                    dataIndex: 'id',
                    minWidth: 50,
                    autoSizeColumn: true
                }
            ].concat(columns, {
                text: 'Notes', dataIndex: 'notes'
            });

            return Ext.create('Ext.grid.Panel', {
                border: true,
                title, store,
                columns: cols,
                loadMask: true,
                flex: 1,
                selModel: {
                    selType: 'checkboxmodel',
                    checkOnly: true,
                    mode: 'MULTI'
                },
                plugins: [
                    {
                        ptype: 'cellediting',
                        clicksToEdit: 1
                    }
                ],
                viewConfig: {trackOver: false, stripeRows: true},
                tools: [
                    {
                        type: 'plus',
                        callback: function (window) {

                        }
                    },
                    {
                        type: 'minus',
                        callback: function (window) {

                        }
                    }
                ]
            })
        };
        let fieldset =  Ext.create('Ext.form.FieldSet', {
            defaultType: 'textfield',
            maxWidth: 700,
            border: false,
            padding: 0,
            defaults: {
                anchor: '100%',
                labelWidth: 50,
                labelSeparator: ''
            },
            items: [
                {
                    fieldLabel: 'ID',
                    name: 'name',
                    emptyText: 'Auto generated',
                    readOnly: true
                },
                {
                    fieldLabel: 'Parent',
                    name: 'product_id'
                },
                {
                    fieldLabel: 'Name',
                    name: 'name',
                    allowBlank: false,
                    selectOnFocus: true
                },
                {
                    fieldLabel: 'Brand',
                    name: 'brand_id',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Status',
                    name: 'status_id',
                    allowBlank: false
                }
            ]
        });
        let gridCode = createGrid('Code', ProductCode, [
            {
                text: 'Code',
                dataIndex: 'code',
                minWidth: 100,
                autoSizeColumn: true
            }
        ]);
        let gridTag = createGrid('Tags', ProductTag, [
            {
                text: 'Tag',
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
            }
        ]);
        let gridPrice = createGrid('Prices', ProductPrice, [
            {
                text: 'Price',
                dataIndex: 'price',
                xtype: 'numbercolumn',
                format: ',0.00',
                minWidth: 120,
                autoSizeColumn: true,
                align: 'right'
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
            }
        ]);
        let gridPriceTax = createGrid('Taxes', ProductPriceTax, [
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
            }
        ]);
        let gridPriceDisc = createGrid('Discounts', ProductPriceDisc, [
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
            }
        ]);
        stores.Status.load();
        stores.Type.load();
        stores.Tag.load();
        stores.Tax.load();
        stores.Unit.load();
        stores.Discount.load();
        stores.ProductTag.load();
        stores.ProductCode.load();
        stores.ProductPrice.load();
        stores.ProductPriceTax.load();
        stores.ProductPriceDisc.load();
        this.setWidth(this.defaultWidth);
        this.setHeight(this.defaultHeight);
        Ext.apply(this, {
            items: [
                {
                    xtype: 'panel',
                    width: '100%',
                    bodyPadding: '10 5 10 5',
                    layout: 'hbox',
                    defaults: {
                        margin: '0 5 0 5',
                        width: '50%',
                        layout: 'anchor',
                        anchor: '100%'
                    },
                    items: [fieldset, gridCode]
                },
                {
                    xtype: 'panel',
                    width: '100%',
                    bodyPadding: '10 5 10 5',
                    layout: 'hbox',
                    defaults: {
                        margin: '0 5 0 5',
                        width: '50%',
                        layout: 'anchor',
                        anchor: '100%'
                    },
                    items: [gridTag, gridPrice]
                },
                {
                    xtype: 'panel',
                    width: '100%',
                    bodyPadding: '10 5 10 5',
                    layout: 'hbox',
                    defaults: {
                        margin: '0 5 0 5',
                        width: '50%',
                        layout: 'anchor',
                        anchor: '100%'
                    },
                    items: [gridPriceTax, gridPriceDisc]
                }
            ]
        });
        this.callParent(arguments);
    }
});
