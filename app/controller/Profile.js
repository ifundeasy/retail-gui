Ext.define('A.controller.Profile', {
    extend: 'Ext.app.Controller',
    views: ['Profile'],
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
        console.log('inited')
    }
});