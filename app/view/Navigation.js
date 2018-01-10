Ext.define('A.view.Navigation', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.navigation',
    region: 'west',
    margins: '5 0 0 5',
    split: true,
    tabPosition: 'left',
    width: 225,
    title: 'Navigation',
    collapsible: true,
    layout: 'fit',
    bodyBorder: true,
    border: true
});