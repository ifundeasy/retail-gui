Ext.define('A.controller.master.ProductWindow', {
    extend: 'Ext.app.Controller',
    views: ['master.ProductWindow'],
    refs: [
        {ref: 'fieldId', selector: 'productWindow [name=id]'},
        {ref: 'fieldParentId', selector: 'productWindow [name=product_id]'},
        {ref: 'fieldBrand', selector: 'productWindow [name=brand_id]'},
        {ref: 'fieldName', selector: 'productWindow [name=name]'},
        {ref: 'fieldStatus', selector: 'productWindow [name=status_id]'},
        {ref: 'window', selector: 'productWindow'},
        {ref: 'save', selector: 'productWindow button[action=save]'},
        {ref: 'close', selector: 'productWindow button[action=close]'},
        {ref: 'nextBtn', selector: 'productWindow button[action=next]'},
        {ref: 'prevBtn', selector: 'productWindow button[action=prev]'}
    ],
    events: {
        'productWindow ' : {
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
        }
    },
    loadData: async function (record) {
        let me = this;
        let id = record.get('id');
        let data = record.getData();
        let {
            Type, Brand, Parent, Product, ProductCode, ProductTag,
            ProductPrice, ProductPriceDisc, ProductPriceTax, Status,
            ProductInfo, Tag, Unit, Tax, Discount
        } = this.stores;

        if (Type.proxy.extraParams) Type.proxy.extraParams = {};

        me.getWindow().setTitle(`Product: "${data.name}"`);
        me.getFieldId().setValue(data.id);
        me.getFieldParentId().setValue(data.product_id ? data.product_id : '');
        me.getFieldBrand().setValue(data.brand_id);
        me.getFieldName().setValue(data.name);
        me.getFieldStatus().setValue(data.status_id);

        Tag.Load();
        Unit.Load();
        Tax.Load();
        Discount.Load();
        Type.Load();
        Status.Load();
        Brand.Load();

        Product.proxy.extraParams = {filter: JSON.stringify({id})};
        ProductCode.proxy.extraParams = {filter: JSON.stringify({product_id: id})};
        ProductTag.proxy.extraParams = {filter: JSON.stringify({product_id: id})};
        ProductPrice.proxy.extraParams = {filter: JSON.stringify({product_id: id})};
        Product.Load();
        ProductCode.Sort('id', 'DESC');
        ProductTag.Sort('id', 'DESC');
        await ProductPrice.Sort('id', 'DESC');
        ProductPriceDisc.proxy.extraParams = {filter: JSON.stringify({productPrice_id: {$in: ProductPrice.data.keys}})};
        ProductPriceTax.proxy.extraParams = {filter: JSON.stringify({productPrice_id: {$in: ProductPrice.data.keys}})};
        ProductPriceDisc.Sort('id', 'DESC');
        ProductPriceTax.Sort('id', 'DESC');


    },
    show: async function () {
        let window = this.getWindow();
        let parent = window.up();
        let pos = parent.getPosition();
        let width = parent.getWidth() - 20,
            height = parent.getHeight() - 20;

        window.setLocalXY(pos[0] + 10, pos[1] + 10, true);
        window.setWidth(width);
        window.setHeight(height);

        this.stores = window.stores;

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
    clickSaveBtn: function () {
        //
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