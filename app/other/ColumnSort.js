Ext.define('A.other.ColumnSort', {
    override: 'Ext.grid.column.Column',
    doSort: function (direction) {
        let store = this.up('grid').getStore();
        let property = this.dataSearch || this.getSortParam();

        //store.sorters.add({property, direction});
        store.sort({property, direction});
    }
});