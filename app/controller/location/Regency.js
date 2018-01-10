Ext.define('A.controller.location.Regency', {
    extend: 'Ext.app.Controller',
    views: ['location.Regency'],
    stores: ['Regency', 'State', 'Status'],
    refs: [
        {ref: 'myGrid', selector: 'masterRegency grid'}
    ],
    events: {
        'masterRegency grid': {
            afterrender: 'addedGrid',
            deselect: 'deselectRow',
            select: 'selectRow',
        },
        'masterRegency grid dataview': {
            refresh: 'refreshView'
        },
        'masterRegency actioncolumn[todo="edit"]': {
            click: 'editRow'
        },
        'masterRegency actioncolumn[todo="delete"]': {
            click: 'deleteRow'
        },
        'masterRegency toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterRegency toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterRegency toolbar button[todo="save"]': {
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
        console.log('masterRegency addRow')
    },
    editRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterRegency editRow')
    },
    deleteRow: function (grid, rowIndex, colIndex, item, e, record) {
        console.log('masterRegency deleteRow')
    },
    deleteRows: function () {
        console.log('masterRegency deleteRows')
    },
    deselectRow: function (model, record, index) {
        console.log('masterRegency deselectRow')
    },
    selectRow: function (model, record, index) {
        console.log('masterRegency selectRow')
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