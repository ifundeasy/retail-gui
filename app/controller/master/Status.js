Ext.define('Axp.controller.master.Status', {
    extend: 'Ext.app.Controller',
    modelBackend: 'status',
    views: ['master.Status'],
    stores: ['Rest'],
    refs: [
        {ref: 'thisGrid', selector: 'grid'}
    ],
    events: {
        'grid': {
            afterlayout: 'onAfterLayout'
        }
    },
    onAfterLayout: function () {
        let me = this;
        let grid = me.getThisGrid();
        let store = this.buildStore(grid);
        store.load();
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