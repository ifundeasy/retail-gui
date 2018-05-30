Ext.define('A.controller.transc.Sales', {
    extend: 'Ext.app.Controller',
    views: ['transc.Sales', 'transc.UnitPriceWindow'],
    refs: [
        {ref: 'unitPriceWindow', selector: 'transcsales unitPriceWindow'},
        //
        {ref: 'masterGrid', selector: 'transcsales grid[prop="salesmaster"]'},
        {ref: 'detailGrid', selector: 'transcsales grid[prop="salesdetail"]'},
        {ref: 'totalItemsLabel', selector: 'transcsales grid[prop="salesdetail"] toolbar label[todo="totalitems"]'},
        {ref: 'totalMoneyLabel', selector: 'transcsales grid[prop="salesdetail"] toolbar label[todo="totalmoney"]'},
        {ref: 'productField', selector: 'transcsales grid[prop="salesdetail"] toolbar textfield[todo="valueFilter"]'},
        {ref: 'addProductBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="add"]'},
        {ref: 'deleteProductsBtn', selector: 'transcsales grid[prop="salesdetail"] toolbar button[todo="delete"]'}
    ],
    temp: {},
    events: {
        'transcsales textfield[todo="valueFilter"]': {
            specialkey: 'pressedEnter'
        },
        'transcsales grid dataview': {
            refresh: 'refreshView'
        },
        'transcsales grid[prop="salesmaster"]': {
            afterrender: 'addTransactionGrid',
            select: 'selectTransaction'
        },
        'transcsales grid[prop="salesmaster"] toolbar button[todo="add"]': {
            click: 'addTransaction'
        },
        'transcsales grid[prop="salesdetail"] toolbar button[todo="add"]': {
            click: 'showQtyWindow'
        },
        'transcsales grid[prop="salesdetail"] toolbar button[todo="delete"]': {
            click: 'deleteProducts'
        },
        'transcsales grid[prop="salesdetail"] gridcolumn[todo="delete"]': {
            click: 'deleteProduct'
        },
        'transcsales grid[prop="salesdetail"] gridcolumn[todo="misc"]': {
            click: 'showVoidWindow'
        },
        'transcsales unitPriceWindow toolbar button[action="add"]': {
            click: 'addProduct'
        }
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
        let {Type, SProduct, TransItemDisc, TransItemTax} = grid.up('transcsales').stores;
        let datetime = new Date(A.app.datetime);

        datetime.setHours(0);
        datetime.setMinutes(0);
        datetime.setSeconds(0);

        let store = grid.getStore();
        let pgtoolbar = grid.down('pagingtoolbar');

        //pgtoolbar.down('#first').hide();
        //pgtoolbar.down('#last').hide();
        pgtoolbar.down('numberfield').hide();
        pgtoolbar.query('text').forEach(function (el) {el.hide()});
        pgtoolbar.query('tbtext').forEach(function (el) {el.hide()});
        pgtoolbar.query('tbseparator').slice(0, 2).forEach(function (el) {el.hide()});

        await TransItemDisc.Load();
        await TransItemTax.Load();
        await Type.Filter({
            name: {
                $or: [
                    {$like: '%jual%'},
                    {$like: '%sale%'}
                ]
            }
        });

        me.temp.type_id = Type.getAt(0).get('id');

        SProduct.sort('name', 'asc');
        store.setFilter({type_id: me.temp.type_id}).sort('id', 'desc');
        //todo: uncomment next line, and delete prev line
        //store.setFilter({dc: {$gte: datetime}, type_id: me.temp.type_id}).sort('id', 'desc');
    },
    selectTransaction: async function (model, record, index) {
        let grid = this.getDetailGrid();
        let {STransactionItem} = grid.up('transcsales').stores;
        let store = grid.getStore();
        let count = 1;
        let Obj = {}, charts = [];

        await STransactionItem.Filter({trans_id: record.get('id')});

        STransactionItem.each(function (chart, i) {
            let o = Object.assign({}, chart.getData());
            if (!o.modifier_id) {
                Obj[o.id] = o;
            }
        });
        STransactionItem.each(function (chart, i) {
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
            obj.nett = obj.total - obj.nett;
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
    addTransaction: async function () {
        let me = this;
        let grid = me.getMasterGrid();
        let store = grid.getStore();
        let datetime = new Date(A.app.datetime);
        let {Code, Trans} = grid.up('transcsales').stores;
        let type_id = me.temp.type_id;

        datetime.setHours(0);
        datetime.setMinutes(0);
        datetime.setSeconds(0);

        await Code.Filter({
            W_FIELD_NAME: 'type_id',
            W_FIELD_VALUE: type_id
        });

        await Trans.Filter({
            type_id, dc: {$gte: datetime}
        });

        let count1 = Code.getAt(0).get('count') + 1;
        let count2 = Trans.totalCount + 1;
        //
        let person_id = A.app.backend.data.user.id;
        let code = [Code.getAt(0).get('value'), Ext.Date.format(A.app.datetime, 'ymd'), count2].join('/');

        Code.getAt(0).set('count', count1);
        Trans.add({code, person_id, type_id});

        await Code.Sync();
        await Trans.Sync();
        await store.Load();

        grid.getSelectionModel().select(0);
    },
    //
    pressedEnter: function (cmp, e) {
        if (e.keyCode === 13) this.showQtyWindow();
    },
    showQtyWindow: async function () {
        let me = this;
        let filter, productField = me.getProductField();
        let grid = me.getDetailGrid();
        let store = grid.getStore();
        let unitPriceWindow = this.getUnitPriceWindow();
        let {SProduct} = grid.up('transcsales').stores;

        if (!productField.valueModels) {
            filter = {productCode_code: productField.getValue()}
        } else if (productField.valueModels[0]) {
            filter = {
                id: productField.valueModels[0].data.id,
                productCode_code: productField.valueModels[0].data.productCode_code
            }
        } else {
            console.error('Error message:', 'Invalid product code');
            return;
        }

        let prices = {}, product = await SProduct.Filter(filter);

        if (!product[0]) {
            console.error('Error message:', 'Product not found');
            return await SProduct.Filter({id: {$gte: 0}});
        }

        product = Object.assign({}, product[0].data);
        product.prices = product.prices.filter(function (price) {
            return price.type_id === me.temp.type_id ? 1 : 0
        });
        product.prices = product.prices.sort(function (a, b) {
            return new Date(b.dc).getTime() - new Date(a.dc).getTime();
        });
        product.prices.forEach(function (price) {
            let k = price.unit_id;
            prices[k] = prices[k] || price;
        });
        product.prices = Object.keys(prices).map(function (k) {
            return prices[k]
        });

        if (!product.prices.length){
            console.error('Error message:', 'Product price not found');
            return;
        }

        unitPriceWindow.INPUT = product;
        unitPriceWindow.show();
    },
    addProduct: async function (el) {
        let me = this;
        let grid = me.getDetailGrid();
        let store = grid.getStore();
        let {TransItem, TransItemDisc, TransItemTax} = grid.up('transcsales').stores;
        let window = el.up('window');
        let {INPUT, OUTPUT} = window;
        let person_id = A.app.backend.data.user.id;
        if (OUTPUT) {
            window.hide();
            try {
                await TransItem.Load();
                TransItem.add({
                    trans_id: store.parent.get('id'),
                    transItem_id: null,
                    modifier_id: null,
                    qty: OUTPUT.qty,
                    productPrice_id: OUTPUT.price.id,
                    person_id, notes: null
                });
                let transItem = await TransItem.Sync();
                let {insertId} = JSON.parse(transItem.operations[0].response.responseText).data;

                OUTPUT.price.discounts.forEach(function(discount){
                    TransItemDisc.add({
                        transItem_id: insertId,
                        productPriceDisc_id: discount.id,
                        person_id, notes: null
                    });
                });
                OUTPUT.price.taxes.forEach(function(tax){
                    TransItemTax.add({
                        transItem_id: insertId,
                        productPriceTax_id: tax.id,
                        person_id, notes: null
                    });
                });

                if (OUTPUT.price.discounts.length) await TransItemDisc.Sync();
                if (OUTPUT.price.taxes.length) await TransItemTax.Sync();

                let record, records = await me.getMasterGrid().getStore().Load();
                for (let r in records) {
                    let rec = records[r];
                    if (rec.get('id') === store.parent.get('id')) {
                        record = rec;
                        break;
                    }
                }
                me.selectTransaction(null, record);
            } catch (e) {
                console.error(e)
            }
        }
    },
    deleteProduct: function (gridView, dom, rowIndex, colIndex, event, record) {
        let grid = this.getDetailGrid();
        let store = grid.getStore();
        let isdone = store.parent.get('isdone');
        if (!isdone) {
            store.remove(record);
            let count = 1, charts = store.data.items.map(function (chart, i) {
                return chart.raw
            });
            charts = charts.map(function (chart, i) {
                chart['no'] = chart.modifier_id ? null : count++;
                return chart;
            });
            store.loadData(charts);
            //todo: removing chart
            console.log('Removing record..', record)
        }
    },
    deleteProducts: function (cmp) {
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
    showVoidWindow: function (gridView, dom, rowIndex, colIndex, event, record) {
        let grid = this.getDetailGrid();
        let store = grid.getStore();
        //todo: show modifier window
        console.log('Showing modifier window..', record)
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
        Ext.create('A.controller.transc.UnitPriceWindow').init();
    }
});