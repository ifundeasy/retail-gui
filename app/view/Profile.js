Ext.require([
    'A.model.Media',
    'A.model.Contact',
    'A.model.Actor',
    'A.model.Status',
    'A.model.Village',
    'A.model.District',
    'A.model.Regency',
    'A.model.State',
    'A.model.National',
    'A.model.Person',
    'A.model.PersonActor',
    'A.model.PersonAddress',
    'A.model.PersonContact',
    'A.model.PersonSession',
    'A.store.Gender'
]);
Ext.define('A.view.Profile', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterProfile',
    initComponent: function () {
        let Media = Ext.create('A.store.Rest', {model: 'A.model.Media'});
        let Contact = Ext.create('A.store.Rest', {model: 'A.model.Contact'});
        let Actor = Ext.create('A.store.Rest', {model: 'A.model.Actor'});
        let Status = Ext.create('A.store.Rest', {model: 'A.model.Status'});
        let Village = Ext.create('A.store.Rest', {model: 'A.model.Village'});
        let District = Ext.create('A.store.Rest', {model: 'A.model.District'});
        let Regency = Ext.create('A.store.Rest', {model: 'A.model.Regency'});
        let State = Ext.create('A.store.Rest', {model: 'A.model.State'});
        let National = Ext.create('A.store.Rest', {model: 'A.model.National'});
        let Person = Ext.create('A.store.Rest', {model: 'A.model.Person'});
        let PersonActor = Ext.create('A.store.Rest', {model: 'A.model.PersonActor'});
        let PersonAddress = Ext.create('A.store.Rest', {model: 'A.model.PersonAddress'});
        let PersonContact = Ext.create('A.store.Rest', {model: 'A.model.PersonContact'});
        let PersonSession = Ext.create('A.store.Rest', {model: 'A.model.PersonSession'});
        let genderStore = Ext.create('A.store.Gender');
        let passWindow = Ext.create('A.view.ChangePassword');
        let container = {
            xtype: 'container',
            layout: {type: 'hbox', align: 'stretch'},
            items: [
                {
                    xtype: 'form',
                    width: '350',
                    padding: 10,
                    defaultType: 'textfield',
                    defaults: {
                        flex: 1,
                        labelSeparator: ''
                    },
                    items: [
                        {
                            fieldLabel: 'Name',
                            name: 'name'
                        },
                        {
                            fieldLabel: 'Gender',
                            name: 'gender',
                            allowBlank: false,
                            xtype: 'suggestbox',
                            displayField: 'name',
                            valueField: 'id',
                            store: genderStore
                        },
                        {
                            fieldLabel: 'Username',
                            name: 'username'
                        },
                        {
                            xtype: 'container',
                            layout: {type: 'hbox', align: 'stretch'},
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Password',
                                    name: 'password',
                                    labelSeparator: ''
                                },
                                {
                                    xtype: 'component',
                                    style: {
                                        marginTop: '5px',
                                        float: 'right'
                                    },
                                    todo: 'triggerWindow',
                                    html: '<i style="color:mediumpurple; cursor: pointer;">Change password&nbsp;</i>'
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            style: {
                                float: 'right',
                                marginTop: '15px'
                            },
                            todo: 'save',
                            text: 'Save'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    //padding: '0 10 10 10',
                    flex: 1,
                    autoScroll: true,
                    tabPosition: 'left',
                    defaultType: 'grid',
                    layout: {type: 'vbox', align: 'stretch'},
                    style: {borderLeft: '1px solid rgb(25, 127, 204);'},
                    defaults: {
                        loadMask: true,
                        width: '100%',
                        flex: 1,
                        selModel: {selType: 'checkboxmodel', checkOnly: true, mode: 'MULTI'},
                        plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
                        viewConfig: {trackOver: false, stripeRows: true},
                    },
                    items: [
                        {
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
                            store: PersonContact,
                            style: {borderTop: '1px solid rgb(25, 127, 204);'},
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
                        }
                    ]
                }
            ]
        };

        this.stores = {
            Media, Contact, Actor, Status,
            Village, District, Regency, State, National,
            Person, PersonActor, PersonAddress,
            PersonContact, PersonSession, genderStore
        };
        Ext.apply(this, {
            items: [passWindow, container]
        });
        this.callParent(arguments);
    }
});