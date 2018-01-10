Ext.define('A.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'A.view.Content',
        'A.view.Navigation',
        'A.view.Login'
    ],
    layout: 'fit',
    renderTo: Ext.getBody(),
    initComponent: function () {
        Ext.apply(this, {
            items: [
                {xtype: 'login'},
                {
                    xtype: 'container',
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
                                {xtype: 'navigation'},
                                {xtype: 'content'}
                            ]
                        },
                        {
                            xtype: 'box',
                            width: '100%',
                            height: 5
                        }
                    ]
                }
            ]
        });
        //
        this.callParent(arguments);
    }
});