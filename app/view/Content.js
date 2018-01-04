Ext.define('Axp.view.Content', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.contentView',
    region: 'center',
    layout: 'fit',
    margins: '5 5 0 0',
    listeners: {
        afterrender: function (elm, eOpts) {
            let element = Ext.query('#' + elm.tabBar.id + ' div[id$=innerCt]')[0];
            element.style.backgroundColor = '#f7f7f7';
        }
    },
    items: [
        {
            xtype: 'panel',
            closable: true,
            border: true,
            title: 'Welcome'
        }
    ]
});