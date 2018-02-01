Ext.define('A.controller.role.Module', {
    extend: 'Ext.app.Controller',
    views: ['role.Module'],
    refs: [
        {ref: 'myContainer', selector: 'masterModule container'},
        {ref: 'myModuleParent', selector: 'masterModule grid[prop="moduleParent"]'},
        {ref: 'myModuleRoute', selector: 'masterModule grid[prop="moduleRoute"]'}
    ],
    ready4Filter: true,
    events: {
        'masterModule textfield[todo=valueFilter]': {
            //change: 'filterGrid',
            specialkey: 'pressedEnter'
        },
        'masterModule checkboxlistcombo': {
            //change: 'filterGrid',
            afterrender: 'addedSearchField'
        },
        'masterModule grid[prop="moduleParent"]': {
            selectionchange: 'selectionchangeGrid',
            itemclick: 'clickRGrid'
        },
        'masterModule grid': {
            afterrender: 'addedGrid'
        },
        'masterModule grid dataview': {
            refresh: 'refreshView'
        },
        'masterModule actioncolumn[todo="edit"]': {
            click: 'editRow'
        },
        'masterModule actioncolumn[todo="delete"]': {
            click: 'deleteRow'
        },
        'masterModule toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterModule toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterModule toolbar button[todo="save"]': {
            click: 'saveRows'
        }
    },
    pressedEnter: function (cmp, e) {
        if (e.keyCode === 13) this.filterGrid(cmp);
    },
    filterGrid: async function (cmp) {
        let me = this;

        if (!me.ready4Filter) return;
        me.ready4Filter = false;
        let store = cmp.up('grid').getStore();
        let fields = cmp.prev().getValue() || [];
        let value = cmp.getValue();
        let $or = [];

        fields.forEach(function (el) {
            if (el !== -1) $or.push({[el]: {$like: `%${value}%`}})
        });

        let params = {offset: 0, page: 1};
        await store.setFilter(value && $or.length ? {$or} : null).load({params});
        me.ready4Filter = true;
    },
    addedSearchField: function (cmp) {
        let keyValueStore = Ext.create('A.store.KeyValue');
        let columns = cmp.up('grid').columns;
        keyValueStore.insert(0, {key: -1, value: 'All'});
        columns.forEach(function (col, i) {
            let key = col.dataIndex;
            if (col.dataSearch) key = col.dataSearch;
            if (key) keyValueStore.insert(i + 1, {key, value: col.text});
        });
        cmp.bindStore(keyValueStore);
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
    addRow: function (cmp) {
        let grid = cmp.up('grid');
        let store = grid.getStore();
        let rec = store.insert(0, {});
        grid.plugins[0].startEditByPosition({
            row: rec[0],
            column: 2
        });
    },
    editRow: function (gridview, rowIndex, colIndex, item, e, record) {
        gridview.ownerCt.plugins[0].startEditByPosition({
            row: record,
            column: 2
        });
    },
    deleteRow: function (gridview, rowIndex, colIndex, item, e, record) {
        let grid = gridview.ownerCt;
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
        let grid = cmp.up('grid');
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
        let grid = cmp.up('grid');
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
    selectionchangeGrid: function (model, record, index) {
        let me = this;
        let store = me.getMyModuleRoute().getStore();

        let params = {offset: 0, page: 1};
        let filter, $in = record.map(function (rec) {
            return rec.get('id')
        });
        if ($in.length) filter = {module_id: {$in}};
        store.setFilter(filter).load({params});
    },
    clickRGrid: function (grid, rec, gridview, index, event) {
        if (event.target.className !== 'x-grid-row-checker') {
            grid.getSelectionModel().select(index);
        }
    },
    addedGrid: async function (grid) {
        let store = grid.getStore();
        await store.Load();
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