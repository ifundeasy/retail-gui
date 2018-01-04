Ext.define('Axp.view.master.Status', {
    extend: 'Ext.panel.Panel',
    items: [
        {
            xtype: 'grid',
            store: Ext.create('Axp.store.Rest'),
            columns: [
                {text: 'ID', dataIndex: 'id', autoSizeColumn: true},
                {text: 'Name', dataIndex: 'name', autoSizeColumn: true},
                {text: 'Notes', dataIndex: 'notes', autoSizeColumn: true}
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {text: 'Docked to the top'}
                    ]
                }
            ]
        }
    ]
});