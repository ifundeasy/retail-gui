Ext.define('A.ux.ComboCheck', {
    extend: 'Ext.container.Container',
    xtype: 'combocheck',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        var comboTPL = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="x-boundlist-item">',
            '<tpl if="values.checked">',
            '<div class="nowrap">',
            '<input type="checkbox" checked="checked" disabled="disabled" />',
            ' {',
            this.displayField,
            '}',
            '</div>',
            '</tpl>',
            '<tpl if="!values.checked">',
            '<div class="nowrap">',
            '<input type="checkbox" disabled="disabled" />',
            ' {',
            this.displayField,
            '}',
            '</div>',
            '</tpl>',
            '</div>',
            '</tpl>' // end for
        );
        console.log(this.displayField);
        console.log(this.store);
        this.items = [
            {
                xtype: 'combo',
                bind: {
                    store: this.store
                },
                displayField: this.displayField,
                valueField: this.valueField,
                editable: this.editable,
                _checkField: this._checkField,
                tpl: comboTPL,
                queryMode: 'local',
                multiSelect: true,
                listeners: {
                    change: function (combo, n) {
                        combo.store.each(function (item) {
                            item.set(combo._checkField, 0);
                        });
                        n.forEach(function (item) {
                            combo.store.findRecord(combo.valueField, item, 0, false, true, true).set(combo._checkField, 1);
                        });
                    }
                }
            }
        ];

        this.callParent();
    }
});