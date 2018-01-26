Ext.define('A.controller.master.Product', {
    extend: 'Ext.app.Controller',
    views: ['master.Product'],
    refs: [
        {ref: 'myGrid', selector: 'masterProduct grid'},
        {ref: 'mySearchField', selector: 'masterProduct checkboxlistcombo'},
        {ref: 'mySearchValue', selector: 'masterProduct textfield[todo=valueFilter]'}
    ],
    ready4Filter: true,
    events: {
        'masterProduct textfield[todo=valueFilter]': {
            //change: 'filterGrid',
            specialkey: 'pressedEnter'
        },
        'masterProduct checkboxlistcombo': {
            //change: 'filterGrid',
            afterrender: 'addedSearchField'
        },
        'masterProduct grid': {
            afterrender: 'addedGrid',
            deselect: 'deselectRow',
            select: 'selectRow',
        },
        'masterProduct grid dataview': {
            refresh: 'refreshView'
        },
        'masterProduct actioncolumn[todo="edit"]': {
            click: 'editRow'
        },
        'masterProduct actioncolumn[todo="delete"]': {
            click: 'deleteRow'
        },
        'masterProduct toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterProduct toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterProduct toolbar button[todo="save"]': {
            click: 'saveRows'
        }
    },
    pressedEnter: function (cmp, e) {
        if (e.keyCode === 13) this.filterGrid();
    },
    filterGrid: async function () {
        let me = this;

        if (!me.ready4Filter) return;
        me.ready4Filter = false;

        let store = me.getMyGrid().getStore();
        let fields = me.getMySearchField().getValue() || [];
        let value = me.getMySearchValue().getValue();
        let $or = [];
        let eParams, filter = {};

        try {
            filter = JSON.parse(store.proxy.extraParams.filter);
        } catch (e) {
           //
        }
        fields.forEach(function (el) {
            if (el !== -1) $or.push({[el]: {$like: `%${value}%`}})
        });

        if (value && $or.length) filter['$or'] = $or;
        else delete filter['$or'];

        if (Object.keys(filter).length) eParams = {filter: JSON.stringify(filter)};

        await store.Load(eParams);
        me.ready4Filter = true;
    },
    addedSearchField: function () {
        let keyValueStore = Ext.create('A.store.KeyValue');
        let columns = this.getMyGrid().columns;
        let searchField = this.getMySearchField();
        keyValueStore.insert(0, {key: -1, value: 'All'});
        columns.forEach(function (col, i) {
            if (col.dataIndex) {
                keyValueStore.insert(i + 1, {key: col.dataIndex, value: col.text})
            }
        });
        searchField.bindStore(keyValueStore);
    },
    refreshView: function (dataview) {
        if (dataview.panel) {
            Ext.each(dataview.panel.columns, function (column) {
                if (column.autoSizeColumn === true) {
                    column.autoSize();
                }
            })
        }

    },
    addRow: function () {
        let grid = this.getMyGrid();
        let store = grid.getStore();
        let rec = store.insert(0, {});
        grid.plugins[0].startEditByPosition({
            row: rec[0],
            column: 2
        });
    },
    editRow: function (gridview, rowIndex, colIndex, item, e, record) {
        this.getMyGrid().plugins[0].startEditByPosition({
            row: record,
            column: 2
        });
    },
    deleteRow: function (gridview, rowIndex, colIndex, item, e, record) {
        let grid = this.getMyGrid();
        let store = grid.getStore();
        Ext.Msg.show({
            title: 'Confirm',
            msg: 'Deleting an item. This action will take effect when you save a data.',
            buttons: Ext.MessageBox.YESNO,
            closeable: false,
            icon: Ext.Msg.QUESTION,
            animateTarget: grid,
            fn: function (choose) {
                if (choose === 'yes') {
                    store.remove(record);
                }
            }
        });
    },
    deleteRows: function (cmp) {
        let grid = this.getMyGrid();
        let {items} = grid.getSelectionModel().selected;
        if (items.length) {
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Delete multiple, ' + items.length + ' items. This action will take effect when you save a data.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: cmp,
                fn: function (choose) {
                    if (choose === 'yes') {
                        grid.getStore().remove(items);
                    }
                }
            });
        }
    },
    saveRows: function (cmp) {
        let total = 0;
        let grid = this.getMyGrid();
        let store = grid.getStore();
        let msg = [], op = {create: 0, delete: 0, update: 0};

        op.delete += store.removed.length;
        store.each(function (rec) {
            if (!rec.raw.id) op.create += 1;
            if (rec.raw.id && rec.dirty) op.update += 1;
        });
        for (let o in op) {
            if (op[o]) {
                total += 1;
                msg.push(o + ' ' + op[o] + ' items');
            }
        }

        if (total) {
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Operation such : ' + msg.join(', ') + ' will be save.<br/>Confirm for saving operation.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: cmp,
                fn: async function (choose) {
                    if (choose === 'yes') {
                        let mySync = await store.Sync();
                        if (mySync instanceof Error) {
                            console.log(mySync)
                        } else {
                            console.log('SUCCESS', mySync);
                            await store.Load();
                        }
                    }
                }
            });
        }
    },
    deselectRow: function (model, record, index) {
        console.log('masterProduct deselectRow')
    },
    selectRow: function (model, record, index) {
        console.log('masterProduct selectRow')
    },
    addedGrid: async function () {
        let me = this;
        let grid = me.getMyGrid();
        let {Type} = grid.up().stores;
        let store = grid.getStore();

        await Type.Load({
            filter: JSON.stringify({
                name: {
                    $or: [
                        {$like: '%jual%'},
                        {$like: '%sale%'}
                    ]
                }
            })
        });
        await store.Load({
            filter: JSON.stringify({
                type_id: Type.getAt(0).get('id')
            })
        });
    },
    init: function () {
        let me = this;
        for (let query in me.events) {
            let events = me.events[query];
            for (let e in events) {
                let handler = me[events[e]];
                if (handler) events[e] = handler;
                else delete events[e]
            }
        }
        me.control(me.events);
    }
});