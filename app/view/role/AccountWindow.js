Ext.define('A.view.role.AccountWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.accountWindow',
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
        {action: 'save', text: 'Save'},
        {action: 'close', text: 'Close'},
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let {
            Media, Contact, Actor, Status, Village, Person,
            PersonActor, PersonAddress, PersonContact,
            PersonSession, genderStore
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
                                    fieldLabel: 'Name',
                                    name: 'name'
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
                                    fieldLabel: 'Gender',
                                    name: 'gender',
                                    allowBlank: false,
                                    xtype: 'suggestbox',
                                    displayField: 'name',
                                    valueField: 'id',
                                    store: genderStore
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
                    autoScroll: true,
                    tabPosition: 'left',
                    defaultType: 'grid',
                    layout: {type: 'hbox', align: 'stretch'},
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
                            title: 'Address',
                            store: PersonAddress,
                            prop: 'personAddress',
                            columns: [
                                {
                                    text: 'ID',
                                    dataIndex: 'id',
                                    minWidth: 60,
                                    autoSizeColumn: true,
                                    locked: true,
                                    lockable: true
                                },
                                {
                                    text: 'Address',
                                    dataIndex: 'value',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    locked: true,
                                    lockable: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Village',
                                    dataIndex: 'village_id',
                                    dataSearch: 'village_name',
                                    minWidth: 150,
                                    autoSizeColumn: true,
                                    locked: true,
                                    lockable: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.village_name || '';
                                        let idx = Village.findExact('id', val);
                                        return (idx === -1) ? '' : Village.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        prop: 'village',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: true,
                                        growMin: 323,
                                        pageSize: 25,
                                        store: Village
                                    }
                                },
                                {
                                    text: 'District',
                                    dataIndex: 'district_name',
                                    minWidth: 150,
                                    sortable: false,
                                    autoSizeColumn: true,
                                    locked: true,
                                    lockable: true
                                },
                                {
                                    text: 'Regency',
                                    dataIndex: 'regency_name',
                                    minWidth: 150,
                                    sortable: false,
                                    autoSizeColumn: true,
                                    lockable: true
                                },
                                {
                                    text: 'State',
                                    dataIndex: 'state_name',
                                    minWidth: 150,
                                    sortable: false,
                                    autoSizeColumn: true,
                                    lockable: true
                                },
                                {
                                    text: 'Country',
                                    dataIndex: 'national_name',
                                    hidden: true,
                                    minWidth: 120,
                                    sortable: false,
                                    autoSizeColumn: true,
                                    lockable: true
                                },
                                {
                                    text: 'Latitude',
                                    dataIndex: 'latitude',
                                    hidden: true,
                                    minWidth: 100,
                                    align: 'right',
                                    autoSizeColumn: true,
                                    lockable: true,
                                    editor: {xtype: 'numberfield'}
                                },
                                {
                                    text: 'Longitude',
                                    dataIndex: 'longitude',
                                    hidden: true,
                                    minWidth: 100,
                                    align: 'right',
                                    autoSizeColumn: true,
                                    lockable: true,
                                    editor: {xtype: 'numberfield'}
                                },
                                {
                                    text: 'Status',
                                    dataIndex: 'status_id',
                                    dataSearch: 'status_name',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    lockable: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.status_name || '';
                                        let idx = Status.findExact('id', val);
                                        return (idx === -1) ? '' : Status.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Status
                                    }
                                },
                                {
                                    text: 'Notes', dataIndex: 'notes',
                                    lockable: true,
                                    editor: {xtype: 'textfield'}
                                }
                            ],
                            margin: '0 5 0 10',
                            dockedItems: [
                                {
                                    xtype: 'pagingtoolbar',
                                    store: PersonAddress,
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
                            title: 'Account Roles',
                            store: PersonActor,
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
                                    dataIndex: 'actor_id',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.actor_name || '';
                                        let idx = Actor.findExact('id', val);
                                        return (idx === -1) ? '' : Actor.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Actor
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
                                        let idx = Status.findExact('id', val);
                                        return (idx === -1) ? '' : Status.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Status
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
                                    store: PersonActor,
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
                            title: 'Contacts',
                            store: PersonContact,
                            margin: '0 0 0 5',
                            columns: [
                                {
                                    text: 'ID',
                                    dataIndex: 'id',
                                    minWidth: 60,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Value',
                                    dataIndex: 'value',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    editor: {xtype: 'textfield'}
                                },
                                {
                                    text: 'Type',
                                    dataIndex: 'contact_id',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.contact_name || '';
                                        let idx = Contact.findExact('id', val);
                                        return (idx === -1) ? '' : Contact.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Contact
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
                                        let idx = Status.findExact('id', val);
                                        return (idx === -1) ? '' : Status.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Status
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
                                    store: PersonContact,
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
                            title: 'Session',
                            store: PersonSession,
                            margin: '0 0 0 5',
                            columns: [
                                {
                                    text: 'ID',
                                    dataIndex: 'id',
                                    minWidth: 60,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Value',
                                    dataIndex: 'value',
                                    minWidth: 100,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Expired At',
                                    dataIndex: 'expires',
                                    minWidth: 100,
                                    autoSizeColumn: true
                                },
                                {
                                    text: 'Status',
                                    dataIndex: 'status_id',
                                    dataSearch: 'status_name',
                                    minWidth: 100,
                                    autoSizeColumn: true,
                                    renderer: function (val, meta, record, rowIndex) {
                                        if (!record.dirty) return record.data.status_name || '';
                                        let idx = Status.findExact('id', val);
                                        return (idx === -1) ? '' : Status.getAt(idx).get('name');
                                    },
                                    editor: {
                                        xtype: 'suggestbox',
                                        displayField: 'name',
                                        valueField: 'id',
                                        editable: false,
                                        store: Status
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
                                    store: PersonSession,
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
                                        '->',
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
        });
        this.callParent(arguments);
    }
});