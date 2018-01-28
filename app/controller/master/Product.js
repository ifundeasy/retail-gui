Ext.define('A.controller.master.Product', {
    extend: 'Ext.app.Controller',
    requires: ['A.controller.master.ProductWindow'],
    views: ['master.Product', 'master.ProductWindow'],
    refs: [
        {ref: 'myEditable', selector: 'masterProduct productWindow'},
        {ref: 'myGrid', selector: 'masterProduct grid[prop="productInfo"]'},
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
        'masterProduct grid[prop="productInfo"]': {
            afterrender: 'addedGrid',
            deselect: 'deselectRow',
            select: 'selectRow',
            itemdblclick: 'doubleClickItem'
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
        'masterProduct grid[prop="productInfo"] toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterProduct grid[prop="productInfo"] toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterProduct grid[prop="productInfo"] toolbar button[todo="save"]': {
            click: 'saveRows'
        }
    },
    showWindow: function (index, record, gridView, event) {
        let window = this.getMyEditable();
        this.windowCtrl.params = {index, record, store: record.store};
        window.show();
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
        let eParams, filter = {};
        let $or = [];

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

        if (Object.keys(filter).length) {
            store.proxy.extraParams = {filter: JSON.stringify(filter)};
        }

        await store.Load();
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
    doubleClickItem: function (gridView, record, dom, index, event) {
        this.showWindow(index, record, gridView, event);
    },
    addRow: async function () {
        let grid = this.getMyGrid();
        let {Brand, Unit, Type, Product, ProductPrice} = grid.up('masterProduct').stores;
        let store = grid.getStore();
        //
        try {
            let name = new Date().getTime().toString(36);
            let unit_id = Unit.getAt(0).get('id');
            let brand_id = Brand.getAt(0).get('id');

            Product.insert(0, {name, brand_id});

            if (Type.count()) {
                let product = await Product.Sync();
                let {insertId} = JSON.parse(product.operations[0].response.responseText).data;
                if (insertId) {
                    ProductPrice.insert(0, {
                        product_id: insertId,
                        type_id: this.type_id,
                        unit_id
                    });
                    await ProductPrice.Sync();
                    await store.load();
                }
            }
        } catch (e) {
            console.error(e)
        }
    },
    editRow: function (gridView, dom, rowIndex, colIndex, event, record) {
        this.showWindow(rowIndex, record, gridView, event);
    },
    deleteRows: function (cmp) {
        let grid = this.getMyGrid();
        let {items} = grid.getSelectionModel().selected;
        let {Product} = grid.up('masterProduct').stores;

        if (items.length) {
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Delete multiple, ' + items.length + ' items. This action will take effect when you save a data.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: cmp,
                fn: async function (choose) {
                    if (choose === 'yes') {
                        let $in = [];
                        items.forEach(function (item) {
                            $in.push(item.get('id'))
                        });
                        Product.proxy.extraParams = {filter: JSON.stringify({id: {$in}})};
                        await Product.Load();
                        Product.removeAll();
                        grid.getStore().remove(items);
                    }
                }
            });
        }
    },
    saveRows: function (cmp) {
        let grid = this.getMyGrid();
        let store = grid.getStore();
        let {Product} = grid.up('masterProduct').stores;
        let msg, deleting = store.removed.length;

        if (deleting) {
            msg = 'Deleting ' + deleting + ' items';
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Operation such : ' + msg + ' will be save.<br/>Confirm for saving operation.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: cmp,
                fn: async function (choose) {
                    if (choose === 'yes') {
                        let mySync = await Product.Sync();
                        if (mySync instanceof Error) {
                            console.log(mySync)
                        } else {
                            console.log('SUCCESS', mySync);
                            Product.proxy.extraParams = {};
                            Product.Load();

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
        let {Unit, Type, Brand, Product, ProductPrice} = grid.up('masterProduct').stores;
        let store = grid.getStore();

        Type.proxy.extraParams = {
            filter: JSON.stringify({
                name: {
                    $or: [
                        {$like: '%jual%'},
                        {$like: '%sale%'}
                    ]
                }
            })
        };
        await Type.Load();

        this.type_id = Type.getAt(0).get('id');
        store.proxy.extraParams = {
            filter: JSON.stringify({
                type_id: this.type_id
            })
        };

        await Product.Load();
        await Unit.Load();
        await Brand.Load();
        await ProductPrice.Load();

        store.sort('id', 'desc');
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
        //
        this.windowCtrl = Ext.create('A.controller.master.ProductWindow');
        this.windowCtrl.init();
    }
});