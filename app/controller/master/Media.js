Ext.define('A.controller.master.Media', {
    extend: 'Ext.app.Controller',
    views: ['master.Media'],
    stores: ['Media', 'Status'],
    refs: [
        {ref: 'myGrid', selector: 'masterMedia grid'}
    ],
    events: {
        'masterMedia grid': {
            afterrender: 'addedGrid',
            deselect: 'deselectRow',
            select: 'selectRow',
        },
        'masterMedia grid dataview': {
            refresh: 'refreshView'
        },
        'masterMedia actioncolumn[todo="edit"]': {
            click: 'editRow'
        },
        'masterMedia actioncolumn[todo="delete"]': {
            click: 'deleteRow'
        },
        'masterMedia toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterMedia toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterMedia toolbar button[todo="save"]': {
            click: 'saveRows'
        }
    },
    refreshView: function (dataview) {
        if (dataview.panel) {
            Ext.each(dataview.panel.columns, function (column) {
                if (column.autoSizeColumn === true)
                    column.autoSize();
            })
        }

    },
    addRow: function () {
        console.log('masterMedia addRow')
    },
    editRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterMedia editRow')
    },
    deleteRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterMedia deleteRow')
    },
    deleteRows: function () {
        console.log('masterMedia deleteRows')
    },
    deselectRow: function (model, record, index) {
        console.log('masterMedia deselectRow')
    },
    selectRow: function (model, record, index) {
        console.log('masterMedia selectRow')
    },
    saveRows: async function () {
        let me = this;
        let grid = me.getMyGrid();
        let store = grid.getStore();
        let mySync = await store.Sync();
        if (mySync instanceof Error) {
            console.log(mySync)
        } else {
            console.log('SUCCESS', mySync);
            await store.Load();
        }
    },
    addedGrid: async function () {
        let me = this;
        let grid = me.getMyGrid();
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