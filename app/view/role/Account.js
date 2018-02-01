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
    'A.store.Gender',
]);
Ext.define('A.view.role.Account', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.masterAccount',
    layout: 'fit',
    stores: {},
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
        let stores = {
            Media, Contact, Actor, Status,
            Village, District, Regency, Person, State, National,
            PersonActor, PersonAddress, PersonContact,
            PersonSession, genderStore
        };
        //
        let columns = [
            //new Ext.grid.RowNumberer(),
            //	z.id, z.name, z.username, z.gender, z.loginCount, z.status_id, z.notes
            {
                text: 'ID',
                dataIndex: 'id',
                minWidth: 60,
                autoSizeColumn: true
            },
            {
                text: 'Name',
                dataIndex: 'name',
                minWidth: 100,
                autoSizeColumn: true,
                editor: {xtype: 'textfield', todo: 'username'}
            },
            {
                text: 'Username',
                dataIndex: 'username',
                minWidth: 100,
                autoSizeColumn: true
            },
            {
                text: 'Gender',
                dataIndex: 'gender',
                minWidth: 100,
                autoSizeColumn: true,
                renderer: function (val, meta, record, rowIndex) {
                    let idx = genderStore.findExact('id', val);
                    return (idx === -1) ? '' : (val === '1' ? 'Male' : 'Female') + ' (' + val + ')';
                },
                editor: {
                    xtype: 'suggestbox',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    store: genderStore
                }
            },
            {
                text: 'Counter',
                align: 'right',
                dataIndex: 'loginCount',
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
        ];
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
        let accountWindow = Ext.create('A.view.role.AccountWindow', {stores});

        this.stores = stores;
        Ext.apply(this, {
            items: [
                accountWindow,
                Ext.create('Ext.grid.Panel', {
                    loadMask: true,
                    prop: 'accountParent',
                    selModel: {
                        selType: 'checkboxmodel', //'Ext.selection.CheckboxModel'
                        checkOnly: true,
                        mode: 'MULTI'
                    },
                    store: Person,
                    columns: columns,
                    plugins: [
                        {
                            ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                            isPlugin: true,
                            clicksToEdit: 1
                        }
                    ],
                    viewConfig: {trackOver: false, stripeRows: true},
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: Person,
                            dock: 'bottom',
                            displayInfo: true,
                            displayMsg: 'Displaying data {0} - {1} of {2}',
                            emptyMsg: 'No data to display',
                            inputItemWidth: 50
                        },
                        navigation
                    ]
                })
            ]
        });
        this.callParent(arguments);
    }
});