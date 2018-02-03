Ext.define('A.view.ChangePassword', {
    extend: 'Ext.window.Window',
    alias: 'widget.changePassword',
    title: 'Change Password',
    width: 400,
    autoHeight: true,
    closeAction: 'hide',
    closable: true,
    resizable: false,
    draggable: true,
    layout: 'fit',
    border: false,
    modal: true,
    buttons: [
        {
            text: 'Save',
            action: 'save',
            formBind: true
        }
    ],
    defaultFocus: 'currentPassword',
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
                        allowBlank: false,
                        inputType: 'password',
                        anchor: '100%',
                        labelSeparator: ''
                    },
                    items: [
                        {
                            fieldLabel: 'Your Password',
                            name: 'currentPassword',
                            selectOnFocus: true,
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'New Password',
                            name: 'newPassword1'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Type Again',
                            name: 'newPassword2'
                        }
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }
});