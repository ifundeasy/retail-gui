Ext.define('Axp.view.Main', {
    extend: 'Ext.container.Container',
    alias: 'widget.mainView',
    requires: [
        'Axp.view.Content',
        'Axp.view.Module'
    ],
    layout: 'vbox',
    items: [
        {
            xtype: 'panel',
            width: '100%',
            buttons: [
                {
                    text: 'Logout',
                    type: 'submit',
                    action: 'logout'
                }
            ]
        },
        {
            xtype: 'panel',
            width: '100%',
            flex: 10,
            layout: 'border',
            bodyStyle: {background: '#f7f7f7'},
            items: [
                {xtype: 'contentView'},
                {xtype: 'moduleView'}
            ]
        },
        {
            xtype: 'box',
            title: 'Inner Panel Three',
            width: '100%',
            height: 20
        }
    ]
})