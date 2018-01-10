Ext.define('A.controller.master.Status', {
    extend: 'Ext.app.Controller',
    views: ['master.Status'],
    stores: ['Status'],
    refs: [
        {ref: 'myGrid', selector: 'masterStatus grid'}
    ],
    events: {
        'masterStatus grid': {
            afterrender: 'addedGrid',
            deselect: 'deselectRow',
            select: 'selectRow',
        },
        'masterStatus grid dataview': {
            refresh: 'refreshView'
        },
        'masterStatus actioncolumn[todo="edit"]': {
            click: 'editRow'
        },
        'masterStatus actioncolumn[todo="delete"]': {
            click: 'deleteRow'
        },
        'masterStatus toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterStatus toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterStatus toolbar button[todo="save"]': {
            click: 'saveRows'
        }
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
    addRow: function () {
        console.log('masterStatus addRow')
    },
    editRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterStatus editRow')
    },
    deleteRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterStatus deleteRow')
    },
    deleteRows: function () {
        console.log('masterStatus deleteRows')
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
    deselectRow: function (model, record, index) {
        console.log('masterStatus deselectRow')
    },
    selectRow: function (model, record, index) {
        console.log('masterStatus selectRow')
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