Ext.define('Axp.controller.master.Status', {
    extend: 'Ext.app.Controller',
    views: ['master.Status'],
    stores: ['Rest'],
    refs: [
        {ref: 'statusGrid', selector: 'grid'}
    ],
    events: {
        'grid': {
            added: 'onAdded'
        }
    },
    onAdded: async function () {
        let me = this;
        let grid = me.getStatusGrid();
        let store = this.buildStore(grid, 'status');
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