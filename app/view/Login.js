Ext.define('A.view.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.login',
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
                    defaults: {
                        xtype: 'textfield',
                        anchor: '100%',
                        labelSeparator: '',
                        allowBlank: false
                    },
                    items: [
                        {
                            itemId: 'username',
                            fieldLabel: 'Username',
                            name: 'username',
                            selectOnFocus: true
                        },
                        {
                            itemId: 'password',
                            fieldLabel: 'Password',
                            name: 'password',
                            inputType: 'password'
                        }
                    ],
                }
            ]
        });
        this.callParent(arguments);
    }
});
