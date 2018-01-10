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
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    style: {
                                        'backgroundColor' : '#197fcc'
                                    },
                                    items: [
                                        {
                                            xtype: 'component',
                                            html: 'Hello World!',
                                            todo: 'appname',
                                            style: {
                                                color: '#FFFFFF',
                                                fontSize: '16px',
                                                fontWeight: 'bolder'
                                            }
                                        },
                                        '->',
                                        {
                                            xtype: 'component',
                                            html: 'Logged as user',
                                            todo: 'username',
                                            style: {
                                                color: '#FFFFFF'
                                            }
                                        },
                                        '',
                                        {
                                            xtype: 'button',
                                            text: 'Logout',
                                            type: 'submit',
                                            action: 'logout',
                                            cls: 'btn-danger',
                                        }
                                    ]
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