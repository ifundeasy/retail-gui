Ext.define('A.controller.master.ProductWindow', {
    extend: 'Ext.app.Controller',
    views: ['master.ProductWindow'],
    refs: [
        {ref: 'window', selector: 'productWindow'},
        {ref: 'gridPrice', selector: 'productWindow grid[prop="productPrice"]'},
        {ref: 'fieldId', selector: 'productWindow [name=id]'},
        {ref: 'fieldParentId', selector: 'productWindow [name=product_id]'},
        {ref: 'fieldBrand', selector: 'productWindow [name=brand_id]'},
        {ref: 'fieldName', selector: 'productWindow [name=name]'},
        {ref: 'fieldStatus', selector: 'productWindow [name=status_id]'},
        {ref: 'saveBtn', selector: 'productWindow button[action=save]'},
        {ref: 'closeBtn', selector: 'productWindow button[action=close]'},
        {ref: 'nextBtn', selector: 'productWindow button[action=next]'},
        {ref: 'prevBtn', selector: 'productWindow button[action=prev]'},
    ],
    events: {
        'productWindow ' : {
            afterrender: 'afterrender',
            show: 'show'
        },
        'productWindow button[action=save]': {
            click: 'clickSaveBtn'
        },
        'productWindow button[action=close]': {
            click: 'clickCloseBtn'
        },
        'productWindow button[action=next]': {
            click: 'clickNextBtn'
        },
        'productWindow button[action=prev]': {
            click: 'clickPrevBtn'
        },
        'productWindow tabpanel' : {
            afterrender: 'afterrenderTabpanel'
        },
        'productWindow grid[prop="productPrice"]': {
            selectionchange: 'selectionchangeGridPrice',
            itemclick: 'clickRGridPrice'
        },
        'productWindow grid dataview': {
            refresh: 'refreshView'
        },
        'productWindow grid toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'productWindow grid toolbar button[todo="delete"]': {
            click: 'deleteRows'
        }
    },
    loadData: async function (record) {
        let me = this;
        let id = record.get('id');
        let data = record.getData();
        let {
            Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax
        } = this.stores;

        me.getWindow().setTitle(`Product: "${data.name}"`);
        me.getFieldId().setValue(data.id);
        me.getFieldParentId().setValue(data.product_id ? data.product_id : '');
        me.getFieldBrand().setValue(data.brand_id);
        me.getFieldName().setValue(data.name);
        me.getFieldStatus().setValue(data.status_id);

        Product.Filter({id});
        ProductCode.setFilter({product_id: id}).Sort('id', 'DESC');
        ProductTag.setFilter({product_id: id}).Sort('id', 'DESC');

        await ProductPrice.setFilter({product_id: id}).Sort('id', 'DESC');

        let $in = ProductPrice.data.keys;
        ProductPriceTax.setFilter({productPrice_id: {$in}}).Sort('id', 'DESC');
        ProductPriceDisc.setFilter({productPrice_id: {$in}}).Sort('id', 'DESC');
    },
    afterrender: async function (window) {
        let me = this;
        let {
            Type, Brand, Status, Tag, Unit, Tax, Discount,
            ProductPriceDisc, ProductPriceTax
        } = me.stores = window.stores;

        let filtering = function () {
            let grid = me.getGridPrice();
            let selection = grid.getSelectionModel().getSelection();
            let ids = grid.getStore().data.keys;
            let $in = selection.map(function (rec) {
                return rec.get('id')
            });

            $in = $in.length ? $in : ids;
            this.setFilter({productPrice_id: {$in}});
        };

        ProductPriceTax.on('beforeload', filtering);
        ProductPriceDisc.on('beforeload', filtering);

        Tag.Load();
        Unit.Load();
        Tax.Load();
        Discount.Load();
        Type.setFilter().Load();
        Status.Load();
        Brand.Load();
    },
    show: async function (window) {
        let parent = window.up();
        let pos = parent.getPosition();
        let width = parent.getWidth() - 20,
            height = parent.getHeight() - 20;

        window.setLocalXY(pos[0] + 10, pos[1] + 10, true);
        window.setWidth(width);
        window.setHeight(height);

        if (this.params.record.get('id')) {
            let {index, record, store} = this.params;
            let {pageSize, totalCount, currentPage} = store;
            let nextBtn = this.getNextBtn();
            let prevBtn = this.getPrevBtn();

            store.realIdx = pageSize * (currentPage - 1) + index;
            window.setTitle(`Product: "${this.params.record.get('name')}"`);

            nextBtn.setDisabled(totalCount === store.realIdx + 1);
            prevBtn.setDisabled(store.realIdx === 0);
            this.loadData(record);
        } else {
            window.setTitle('Add New Product');
            this.getPrevBtn().setDisabled(1);
            this.getNextBtn().setDisabled(0);
        }
    },
    afterrenderTabpanel: function (elm, eOpts) {
        let element = Ext.query('#' + elm.tabBar.id + ' div[id$=innerCt]')[0];
        element.style.backgroundColor = '#fff';
    },
    shouldSync: function (store, list) {
        let should = [];
        if (store.removed.length) should.push(true);
        store.each(function (rec) {
            if (!rec.get('id')) should.push(true);
            else should.push(rec.dirty);
        });

        this.shouldSave.push(should.indexOf(true) > -1);
        return (should.indexOf(true) > -1)
    },
    clickSaveBtn: async function (btn) {
        let me = this;
        let {ProductInfo, Product, ProductCode, ProductTag, ProductPrice, ProductPriceTax, ProductPriceDisc} = this.stores;
        let product = Product.getAt(0);
        let id = product.get('id');
        let configMsg = {
            title: 'Save Product',
            msg: 'Nothing to be saved!',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING
        };

        btn.setDisabled(1);

        me.shouldSave = [];
        product.set({
            product_id: me.getFieldParentId().getValue(),
            brand_id: me.getFieldBrand().getValue(),
            name: me.getFieldName().getValue(),
            status_id: me.getFieldStatus().getValue()
        });

        if (me.shouldSync(Product)) {
            await Product.Sync();
            await Product.Load();
        }
        if (me.shouldSync(ProductCode)) {
            await ProductCode.Sync();
            await ProductCode.Load();
        }
        if (me.shouldSync(ProductTag)) {
            await ProductTag.Sync();
            await ProductTag.Load();
        }
        if (me.shouldSync(ProductPrice)) {
            await ProductPrice.Sync();
            await ProductPrice.Load();
        }
        if (me.shouldSync(ProductPriceTax)) {
            await ProductPriceTax.Sync();
            await ProductPriceTax.Load();
        }
        if (me.shouldSync(ProductPriceDisc)) {
            await ProductPriceDisc.Sync();
            await ProductPriceDisc.Load();
        }

        let saveAny = me.shouldSave.indexOf(true) > -1;

        if (saveAny) {
            configMsg.icon = Ext.Msg.INFO;
            configMsg.msg = 'Saving success';
            await ProductInfo.Load();
        }

        Ext.Msg.show(configMsg);
        btn.setDisabled(0);
    },
    clickCloseBtn: function () {
        this.getWindow().hide();
    },
    clickNextBtn: async function () {
        let me = this;
        let {index, store} = me.params;
        let nextIdx = index + 1;
        let {pageSize, totalCount, currentPage} = store;

        if (store.getAt(nextIdx)) {
            me.params.index = nextIdx;
            me.params.record = store.getAt(nextIdx);
            me.params.store = me.params.record.store;
            me.params.store.realIdx += 1;
        } else if (Math.round(totalCount / pageSize) > currentPage) {
            await store.NextPage();
            me.params.index = 0;
            me.params.record = store.getAt(0);
            me.params.store = me.params.record.store;
            me.params.store.realIdx += 1;
        }

        if (me.params.store.totalCount - 1 === me.params.store.realIdx) {
            this.getNextBtn().setDisabled(1);
        }
        if (me.params.store.realIdx) {
            this.getPrevBtn().setDisabled(0);
        } else {
            this.getPrevBtn().setDisabled(1);
        }

        me.loadData(me.params.record)
    },
    clickPrevBtn: async function () {
        let me = this;
        let {index, store} = me.params;
        let prevIdx = index - 1;
        let {realIdx, pageSize, totalCount, currentPage} = store;

        if (prevIdx > -1 && store.getAt(prevIdx)) {
            me.params.index = prevIdx;
            me.params.record = store.getAt(prevIdx);
            me.params.store = me.params.record.store;
            me.params.store.realIdx -= 1;
        } else if (realIdx > -1) {
            await store.PreviousPage();
            me.params.index = pageSize - 1;
            me.params.record = store.getAt(pageSize - 1);
            me.params.store = me.params.record.store;
            me.params.store.realIdx -= 1;
        }

        if (me.params.store.realIdx === 0) {
            this.getPrevBtn().setDisabled(1);
        }
        if (me.params.store.getAt(me.params.store.realIdx + 1)) {
            this.getNextBtn().setDisabled(0);
        } else {
            this.getNextBtn().setDisabled(1);
        }

        me.loadData(me.params.record)
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
    selectionchangeGridPrice: function (model, record, index) {
        let me = this;
        let {ProductPriceTax, ProductPriceDisc} = me.stores;

        ProductPriceTax.Load();
        ProductPriceDisc.Load();
    },
    clickRGridPrice: function (grid, rec, gridview, index, event) {
        if (event.target.className !== 'x-grid-row-checker') {
            grid.getSelectionModel().select(index);
        }
    },
    addRow: async function (btn, event) {
        let me = this;
        let {Product, Type, Unit} = me.stores;
        let product_id = Product.getAt(0).get('id');
        let grid = btn.up('grid');
        let store = grid.getStore();
        let clsName = store.model.$className;
        let rec, justOK = true;

        if (clsName === 'A.model.ProductPrice') {
            rec = store.insert(0, {
                product_id,
                type_id: Type.getAt(0).get('id'),
                unit_id: Unit.getAt(0).get('id')
            });
            await store.Sync();
            await store.Load();
        } else if (['A.model.ProductPriceTax', 'A.model.ProductPriceDisc'].indexOf(clsName) > -1) {
            let priceTarget = me.getGridPrice().getSelectionModel().getSelection()[0];
            if (priceTarget) {
                rec = store.insert(0, {productPrice_id: priceTarget.get('id')})
            } else {
                justOK = false
            }
        } else {
            rec = store.insert(0, {product_id})
        }

        if (justOK) {
            grid.plugins[0].startEditByPosition({
                row: rec[0],
                column: 2
            });
        }
    },
    deleteRows: function (btn) {
        let grid = btn.up('grid');
        let {items} = grid.getSelectionModel().selected;
        if (items.length) {
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Delete multiple, ' + items.length + ' items. This action will take effect when you save a data.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: btn,
                fn: function (choose) {
                    if (choose === 'yes') {
                        grid.getStore().remove(items);
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