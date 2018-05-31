Ext.define('A.controller.transc.UnitPriceWindow', {
    extend: 'Ext.app.Controller',
    views: ['transc.UnitPriceWindow'],
    refs: [
        {ref: 'window', selector: 'unitPriceWindow'},
        {ref: 'buttonsPanel', selector: 'unitPriceWindow panel[todo="buttons"]'},
        {ref: 'priceLbl', selector: 'unitPriceWindow panel[todo="buttons"] toolbar label[todo="price"]'},
        {ref: 'discountLbl', selector: 'unitPriceWindow panel[todo="buttons"] toolbar label[todo="discounts"]'},
        {ref: 'nettpriceLbl', selector: 'unitPriceWindow panel[todo="buttons"] toolbar label[todo="nettprice"]'},
        {ref: 'buttonsPanel', selector: 'unitPriceWindow panel[todo="buttons"]'},
        {ref: 'qtyField', selector: 'unitPriceWindow numberfield[todo="qty"]'},
        {ref: 'closeBtn', selector: 'unitPriceWindow button[action="close"]'},
        {ref: 'addBtn', selector: 'unitPriceWindow button[action="add"]'}
    ],
    activeBtn: null,
    events: {
        'unitPriceWindow': {
            show: 'show'
        },
        'unitPriceWindow numberfield[todo="qty"]': {
            change: 'calculate',
            specialkey: 'pressedEnter'
        },
        'unitPriceWindow panel[todo="buttons"] button': {
            click: 'clickUnitBtn'
        },
        'unitPriceWindow button[action=save]': {
            click: 'clickSaveBtn'
        },
        'unitPriceWindow button[action=close]': {
            click: 'clickCloseBtn'
        }
    },
    show: async function (window) {
        let me = this;
        let {INPUT} = window;
        let panel = me.getButtonsPanel();
        //
        me.activeBtn = null;
        window.setTitle(`Qty: ${INPUT.name} (${INPUT.productCode_code})`);
        panel.removeAll();
        INPUT.prices.forEach(function (price) {
            panel.add({
                data: price,
                html: `
                    <p class="unit-button" style="color: white">${price.unit_short}</p>
                    <p class="unit-button" >${me.formatMoney(price.price)}</p>
                `
            });
        });
        me.getPriceLbl().setText(me.formatMoney(0));
        me.getDiscountLbl().setText(me.formatMoney(0));
        me.getNettpriceLbl().setText(me.formatMoney(0));
        me.getQtyField().setValue(1);
        me.getQtyField().focus();
        window.OUTPUT = null;
    },
    clickUnitBtn: function (el) {
        let me = this;
        me.activeBtn = el;
        Ext.query('.unit-button').forEach(function(q){
            q.style.color = 'white';
            if (el.id === q.parentNode.id.replace('-btnInnerEl', '')) {
                q.style.color = 'orange';
            }
        });
        me.calculate();
    },
    formatMoney: function (int) {
        let {currency} = A.app;
        return currency + ' ' + A.app.formatMoney(int);
    },
    calculate: function () {
        let me = this;
        let el = me.activeBtn;
        let qty = me.getQtyField().getValue();
        let window = me.getWindow();
        if (el && qty) {
            let price = el.data.price * qty;
            let discounts = 0;
            el.data.discounts = el.data.discounts || [];
            el.data.discounts.forEach(function (item) {
                let disc = item.discount_isPercent === '0' ? item.discount_value : el.data.price * item.discount_value / 100;
                discounts += (disc * qty)
            });
            me.getPriceLbl().setText(me.formatMoney(price));
            me.getDiscountLbl().setText(me.formatMoney(discounts));
            me.getNettpriceLbl().setText(me.formatMoney(price - discounts));
            window.OUTPUT = {
                qty, price: el.data
            }
        }
        me.getQtyField().focus();
    },
    pressedEnter: function (cmp, e) {
        if (e.keyCode === 13) {
            this.getAddBtn().fireEvent('click', this.getAddBtn());
        }
    },
    clickCloseBtn: function () {
        this.getWindow().hide();
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