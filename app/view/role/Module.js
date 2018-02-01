Ext.require([
    'A.model.Module',
    'A.model.ModuleRoute',
    'A.model.HttpMethod',
    'A.model.Status',
    'A.store.YesNo'
]);
Ext.define('A.view.role.Module', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterModule',
    initComponent: function () {
        let store = Ext.create('A.store.Rest', {model: 'A.model.Module'});
        let parentStore = Ext.create('A.store.Rest', {model: 'A.model.Module'});
        let yesNoStore = Ext.create('A.store.YesNo');
        let routeStore = Ext.create('A.store.Rest', {model: 'A.model.ModuleRoute'});
        let httpMethodStore = Ext.create('A.store.Rest', {model: 'A.model.HttpMethod'});
        let statusStore = Ext.create('A.store.Rest', {model: 'A.model.Status'});
        let navigation = {
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
        };

        Ext.apply(this, {
            items: [
                {
                    xtype: 'container',
                    defaultType: 'grid',
                    padding: '5 10 5 10',
                    defaults: {
                        padding: '5 0 5 0',
                        border: true,
                        loadMask: true,
                        height: '50%',
                        flex: 1,
                        selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                        plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                        viewConfig: {trackOver: false, stripeRows: true},
                    },
                    layout: {type: 'vbox', align: 'stretch'},
                    items: [
                        {
                            title: 'Application Module',
                            height: '50%',
                            prop: 'moduleParent',
                            store: store,
                            columns: [
                                {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
                                {
                                    text: 'Parent',
                                    dataIndex: 'module_id',
                                    dataSearch: 'module_name',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.module_name || '';
                                        let idx = parentStore.findExact('id', val);
                                        return (idx === -1) ? '' : parentStore.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: true,
                                        growMin: 323,
                                        pageSize: 20,
                                        store: parentStore
                                    }
                                },
                                {
                                    text: 'Name',
                                    dataIndex: 'name',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Class',
                                    dataIndex: 'class',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Sorter',
                                    dataIndex: 'seq',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'numberfield', minValue: 0}
                                },
                                {
                                    text: 'Collapsed',
                                    dataIndex: 'collapsed',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        let idx = yesNoStore.findExact('id', val);
                                        return (idx === -1) ? '' : yesNoStore.getAt(idx).get('name') + ' (' + val + ')';
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: yesNoStore
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
                                navigation
                            ]
                        },
                        {
                            title: 'URL Route',
                            store: routeStore,
                            height: '50%',
                            prop: 'moduleRoute',
                            flex: 1,
                            columns: [
                                {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
                                {
                                    text: 'Module',
                                    dataIndex: 'module_id',
                                    dataSearch: 'module_name',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.module_name || '';
                                        let idx = parentStore.findExact('id', val);
                                        return (idx === -1) ? '' : parentStore.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: true,
                                        growMin: 323,
                                        pageSize: 20,
                                        store: parentStore
                                    }
                                },
                                {
                                    text: 'TABLENAME',
                                    dataIndex: 'TABLENAME',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Path',
                                    dataIndex: 'value',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Method',
                                    dataIndex: 'httpmethod_id',
                                    dataSearch: 'httpmethod_code',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.httpmethod_code || '';
                                        let idx = httpMethodStore.findExact('id', val);
                                        return (idx === -1) ? '' : httpMethodStore.getAt(idx).get('code');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'code',
                                        valueField: 'id',
                                        editable: false,
                                        store: httpMethodStore
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
                            dockedItems: [
                                {
                                    xtype: 'pagingtoolbar',
                                    store: routeStore,
                                    dock: 'bottom',
                                    displayInfo: true,
                                    displayMsg: 'Displaying data {0} - {1} of {2}',
                                    emptyMsg: 'No data to display',
                                    inputItemWidth: 50
                                },
                                navigation
                            ]
                        }
                    ]
                }
            ]
        });

        this.callParent(arguments);
    }
});