Ext.define('Axp.view.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.loginView',
    title: 'Please login',
    width: 400,
    autoHeight: true,
    closable: false,
    resizable: false,
    draggable: true,
    layout: 'fit',
    border: false,
    modal: true,
    buttons: [
        {
            text: 'Login',
            action: 'login',
            formBind: true
        }
    ],
    defaultFocus: 'username',
    initComponent: function () {
        Ext.apply(this, {
            items: [
                {
                    xtype: 'form',
                    plain: true,
                    bodyBorder: false,
                    bodyPadding: 10,
                    items: [
                        {
                            itemId: 'username',
                            xtype: 'textfield',
                            fieldLabel: 'Username',
                            name: 'username',
                            allowBlank: false,
                            anchor: '100%',
                            selectOnFocus: true
                        },
                        {
                            itemId: 'password',
                            xtype: 'textfield',
                            fieldLabel: 'Password',
                            name: 'password',
                            allowBlank: false,
                            inputType: 'password',
                            anchor: '100%',
                            selectOnFocus: true
                        }
                    ],
                }
            ]
        });
        this.callParent(arguments);
    }
});
