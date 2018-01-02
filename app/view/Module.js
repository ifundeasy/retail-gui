Ext.define('Axp.view.Module', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.moduleView',
    region: 'west',
    margins: '5 0 0 5',
    split: true,
    tabPosition: 'left',
    width: 225,
    layout: 'fit',
    bodyBorder: true,
    border: true,
    listeners: {
        afterrender: function (elm, eOpts) {
            //let element = Ext.query('#' + elm.tabBar.id + ' div[id$=innerCt]')[0];
            //element.style.backgroundColor = '#f7f7f7';
        }
    }
});