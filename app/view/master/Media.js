Ext.require([
    'A.ux.CheckboxListCombo',
    'A.store.Media',
    'A.store.Status',
    'A.store.Table',
]);
Ext.define('A.view.master.Media', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterMedia',
    initComponent: function () {
        let store = Ext.create('A.store.Media');
        let statusStore = Ext.create('A.store.Status');

        Ext.apply(this, {
            items: [
                {
                    id: 'xx',
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
                            text: 'Name',
                            dataIndex: 'name',
                            minWidth: 100,
                            autoSizeColumn: true,
                            editor: {xtype: 'textfield'}
                        },
                        {
                            text: 'Table',
                            dataIndex: 'TABLENAME',
                            minWidth: 100,
                            autoSizeColumn: true,
                            editor: {
                                xtype: 'combobox',
                                store: Ext.create('A.store.Table'),
                                autoScroll: true,
                                autoShow: true,
                                forceSelection: true,
                                queryMode: 'remote',
                                displayField: 'name',
                                valueField: 'name'
                            }
                        },
                        {
                            text: 'For ID',
                            dataIndex: 'TABLENAME_id',
                            minWidth: 100,
                            autoSizeColumn: true,
                            editor: {
                                xtype: 'numberfield',
                                minValue: 1
                            }
                        },
                        {
                            text: 'Status',
                            dataIndex: 'status_id',
                            minWidth: 100,
                            autoSizeColumn: true,
                            renderer: function(val, meta, record, rowIndex) {
                                if (!record.dirty) return record.data.status_name;
                                let idx = statusStore.findBy(function (rec) {
                                    if (rec.data.id == val) return 1;
                                    return 0
                                });
                                return statusStore.getAt(idx).get('name')
                            },
                            editor: {
                                xtype: 'combobox',
                                store: statusStore,
                                autoScroll: true,
                                autoShow: true,
                                forceSelection: true,
                                queryMode: 'remote',
                                displayField: 'name',
                                valueField: 'id'
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