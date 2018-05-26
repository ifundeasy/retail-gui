Ext.define('A.controller.transc.Sales', {
    extend: 'Ext.app.Controller',
    views: ['transc.Sales'],
    refs: [
        {ref: 'masterGrid', selector: 'transcsales grid[prop="salesmaster"]'},
        {ref: 'detailGrid', selector: 'transcsales grid[prop="salesdetail"]'},
        {ref: 'infoGrid', selector: 'transcsales grid[prop="salesinfo"]'},
        {ref: 'totalItemsLabel', selector: 'transcsales grid[prop="salesdetail"] toolbar label[todo="totalitems"]'},
        {ref: 'totalMoneyLabel', selector: 'transcsales grid[prop="salesdetail"] toolbar label[todo="totalmoney"]'},
        {ref: 'productField', selector: 'transcsales grid[prop="salesdetail"] toolbar textfield[todo="valueFilter"]'},
        {ref: 'addProductBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="add"]'},
        {ref: 'deleteProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="remove"]'}
        //{ref: 'voidProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="void"]'},
        //{ref: 'bonusProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="bonus"]'},
        //{ref: 'complimentaryProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="complimentary"]'},
        //{ref: 'sampleProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="sample"]'}
    ],
    ready4Filter: true,
    events: {
        'transcsales textfield[todo="valueFilter"]': {
            specialkey: 'pressedEnter'
        },
        'transcsales grid dataview': {
            refresh: 'refreshView'
        },
        'transcsales grid[prop="salesmaster"]': {
            afterrender: 'addTransactionGrid',
            itemclick: 'selectTransaction'
        },
        'transcsales grid[prop="salesdetail"]': {
            itemclick: 'selectProduct'
        },
        'transcsales grid[prop="salesmaster"] toolbar button[todo="add"]': {
            click: 'addTransaction'
        },
        'transcsales grid[prop="salesdetail"] toolbar button[todo="add"]': {
            click: 'addProduct'
        },
        'transcsales grid[prop="salesdetail"] toolbar button[todo="remove"]': {
            click: 'removeProducts'
        },
        'transcsales grid[prop="salesdetail"] gridcolumn[todo="action"]': {
            click: 'actionProduct'
        },
    },
    pressedEnter: function (cmp, e) {
        if (e.keyCode === 13) this.filterGrid();
    },
    refreshView: function (dataview) {
        if (dataview.panel) {
            Ext.each(dataview.panel.columns, function (column) {
                if (column.autoSizeColumn === true) {
                    try {
                        column.autoSize();
                        column.setWidth(column.width + 5)
                    } catch (e) {
                        //
                    }
                }
            })
        }
    },
    addTransactionGrid: async function () {
        let me = this;
        let grid = me.getMasterGrid();
        let {Unit, Type, Brand, Product, ProductPrice} = grid.up('transcsales').stores;
        let store = grid.getStore();
        let pgtoolbar = grid.down('pagingtoolbar');

        //pgtoolbar.down('#first').hide();
        //pgtoolbar.down('#last').hide();
        pgtoolbar.down('numberfield').hide();
        pgtoolbar.query('text').forEach(function (el) {el.hide()});
        pgtoolbar.query('tbtext').forEach(function (el) {el.hide()});
        pgtoolbar.query('tbseparator').slice(0, 2).forEach(function (el) {el.hide()});

        await Type.Filter({
            name: {
                $or: [
                    {$like: '%jual%'},
                    {$like: '%sale%'}
                ]
            }
        });

        this.type_id = Type.getAt(0).get('id');

        await Product.Load();
        await Unit.Load();
        await Brand.Load();
        await ProductPrice.Load();
        store.setFilter({type_id: this.type_id}).sort('id', 'desc');
    },
    selectProduct: function (model, record, index) {
        let grid = this.getInfoGrid();
        let store = grid.getStore();
        store.Filter({transItem_id: record.get('id')})
    },
    selectTransaction: async function (model, record, index) {
        let grid = this.getDetailGrid();
        let {TransactionItem} = grid.up('transcsales').stores;
        let store = grid.getStore();
        let count = 1;
        let Obj = {}, charts = [];

        await TransactionItem.Filter({trans_id: record.get('id')});

        TransactionItem.each(function (chart, i) {
            let o = Object.assign({}, chart.getData());
            if (o.modifier_id) {
                let key = o.transItem_id;
                Obj[key].children = Obj[key].children || {};
                if (Obj[key].children.hasOwnProperty(o.modifier_id)) {
                    Obj[key].children[o.modifier_id].disc += o.disc;
                    Obj[key].children[o.modifier_id].qty += o.qty;
                    Obj[key].children[o.modifier_id].tax += o.tax;
                    Obj[key].children[o.modifier_id].total += o.total;
                    Obj[key].children[o.modifier_id].id.push(o.id);
                } else {
                    Obj[key].children[o.modifier_id] = o;
                    Obj[key].children[o.modifier_id].id = [o.id];
                }
            } else {
                Obj[o.id] = o;
            }
        });
        for (let key in Obj) {
            let obj = Obj[key];
            obj['no'] = count;
            charts.push(obj);
            if (obj.children) {
                let notnetted = 0;
                for (let k in obj.children) {
                    notnetted += obj.children[k].total;
                    obj.info = obj.info || {};
                    obj.info[obj.children[k]['modifier_name']] = 0;
                    obj.info[obj.children[k]['modifier_name']] += obj.children[k]['qty']
                    //charts.push(obj.children[k]);
                }
                obj.info = JSON.stringify(obj.info, 0, 2).replace(/\"/g, '');
                obj.nett = notnetted;
            } else {
                obj.qties = 0;
                obj.info = '-';
            }
            count++;
        }
        store.parent = record;
        store.loadData(charts);
        //
        this.getTotalItemsLabel().setText(record.get('numofprod'));
        this.getTotalMoneyLabel().setText(
            this.getTotalMoneyLabel().prefix +
            Ext.util.Format.number(record.get('total'), '0,000.00')
        );
        //this.getBonusProductsBtn().show();
        //this.getComplimentaryProductsBtn().show();
        //this.getSampleProductsBtn().show();
        if (store.parent.get('isdone')) {
            this.getDeleteProductsBtn().hide();
            this.getProductField().hide();
            this.getAddProductBtn().hide();
        } else {
            this.getDeleteProductsBtn().show();
            this.getAddProductBtn().show();
            this.getProductField().show();
        }
    },
    addTransaction: function () {
        console.log('transcsales addTransaction')
    },
    //
    filterGrid: async function () {
        let me = this;

        if (!me.ready4Filter) return;
        me.ready4Filter = false;

        let store = me.getDetailGrid().getStore();
        let fields = [];
        let value = me.getProductField().getValue();
        let filter = store.getFilter() || {}, $or = [];

        fields.forEach(function (el) {
            if (el !== -1) $or.push({[el]: {$like: `%${value}%`}})
        });

        if (value && $or.length) filter['$or'] = $or;
        else delete filter['$or'];

        await store.Filter(Object.keys(filter).length ? filter : null);
        me.ready4Filter = true;
    },
    addProduct: async function () {
        let grid = this.getDetailGrid();
        let {Brand, Unit, Type, Product, ProductPrice} = grid.up('transcsales').stores;
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
    actionProduct: function (gridView, dom, rowIndex, colIndex, event, record) {
        let grid = this.getDetailGrid();
        let store = grid.getStore();
        let isdone = store.parent.get('isdone');
        if (isdone) {
            console.log('Will showing', [
                {id: 1, name: 'Void'},
                {id: 2, name: 'Returns'},
                {id: 3, name: 'Bonus'},
                {id: 4, name: 'Complimentary'},
                {id: 5, name: 'Sample'}
            ])
        } else {
            store.remove(record);
            let count = 1, charts = store.data.items.map(function (chart, i) {
                return chart.raw
            });
            charts = charts.map(function (chart, i) {
                chart['no'] = chart.modifier_id ? null : count++;
                return chart;
            });
            store.loadData(charts);
        }
    },
    removeProducts: function (cmp) {
        let grid = this.getDetailGrid();
        let {items} = grid.getSelectionModel().selected;
        let {Product} = grid.up('transcsales').stores;

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
                        await Product.Filter({id: {$in}});
                        Product.removeAll();
                        grid.getStore().remove(items);
                    }
                }
            });
        }
    },
    saveProducts: function (cmp) {
        let grid = this.getDetailGrid();
        let store = grid.getStore();
        let {Product} = grid.up('transcsales').stores;
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
                            Product.Filter();
                            await store.Load();
                        }
                    }
                }
            });
        }
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