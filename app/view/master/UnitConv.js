Ext.require([
    'A.model.Unit',
    'A.model.UnitConv',
    'A.model.Status'
]);
Ext.define('A.view.master.UnitConv', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterUnitConv',
    initComponent: function () {
        let store = Ext.create('A.store.Rest', {model: 'A.model.UnitConv'});
        let parentStore = Ext.create('A.store.Rest', {model: 'A.model.Unit'});
        let statusStore = Ext.create('A.store.Rest', {model: 'A.model.Status'});

        Ext.apply(this, {
            items: [
                {
                    xtype: 'grid',
                    loadMask: true,
                    selModel: {
                        selType: 'checkboxmodel', //'Ext.selection.CheckboxModel'
                        checkOnly: true,
                        mode: 'MULTI'
                    },
                    store: store,
                    columns: [
                        //new Ext.grid.RowNumberer(),
                        {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
                        {
                            text: 'Unit Base',
                            dataIndex: 'base_id',
                            dataSearch: 'base_name',
                            minWidth: 100,
                            autoSizeColumn: true,
                            renderer: function (val, meta, record, rowIndex) {
                                let idx = parentStore.findExact('id', val);
                                return (idx === -1) ? '' : parentStore.getAt(idx).get('name');
                            },
                            editor: {
                                xtype: 'suggestbox',
                                displayField: 'name',
                                valueField: 'id',
                                pageSize: 20,
                                growMin: 323,
                                store: parentStore
                            }
                        },
                        {
                            text: 'Value', dataIndex: 'value',
                            editor: {xtype: 'numberfield', minValue: 1}
                        },
                        {
                            text: 'Unit',
                            dataIndex: 'unit_id',
                            dataSearch: 'unit_name',
                            minWidth: 100,
                            autoSizeColumn: true,
                            renderer: function (val, meta, record, rowIndex) {
                                let idx = parentStore.findExact('id', val);
                                return (idx === -1) ? '' : parentStore.getAt(idx).get('name');
                            },
                            editor: {
                                xtype: 'suggestbox',
                                displayField: 'name',
                                valueField: 'id',
                                pageSize: 20,
                                growMin: 323,
                                store: parentStore
                            }
                        },
                        {
                            text: 'Status',
                            dataIndex: 'status_id',
                            dataSearch: 'status_name',
                            minWidth: 100,
                            autoSizeColumn: true,
                            renderer: function (val, meta, record, rowIndex) {
                                if (!record.dirty) return record.data.status_name || '';
                                let idx = statusStore.findExact('id', val);
                                return (idx === -1) ? '' : statusStore.getAt(idx).get('name');
                            },
                            editor: {
                                xtype: 'suggestbox',
                                displayField: 'name',
                                valueField: 'id',
                                editable: false,
                                store: statusStore
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
                    ],
                    plugins: [
                        {
                            ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                            clicksToEdit: 1
                        }
                    ],
                    viewConfig: {
                        trackOver: false,
                        stripeRows: true,
                    },
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: store,
                            dock: 'bottom',
                            displayInfo: true,
                            displayMsg: 'Displaying data {0} - {1} of {2}',
                            emptyMsg: 'No data to display',
                            inputItemWidth: 50
                        },
                        {
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
                        }
                    ]
                }
            ]
        });

        this.callParent(arguments);
    }
});