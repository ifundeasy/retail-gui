Ext.define('A.other.SuggestBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.suggestbox',
    displayField: 'name',
    valueField: 'id',
    minChars: 2,
    anyMatch: true,
    autoShow: true,
    autoSelect: true,
    typeAhead: true,
    selectOnFocus: true,
    queryMode: 'remote',
    queryParam: 'filter',
    triggerAction: 'all',
    maxLength: 100,
    enforceMaxLength: true,
    autoRender: true,
    grow: true,
    growMin: 100,
    //pageSize: 20,
    //growMin: 323, //if using pageSize make sure growMin value is 323, it's make your pagingToolbar fit with suggestion box
    //maxWidth: 200, //use maxWidth for restrict input box width constraint instead suggestion box
    listeners: {
        afterrender: function () {
            this.growMin += 20;
            this.listConfig = {
                itemTpl: `{${this.displayField}} <i style="color: rgba(0,0,0,0.2)">(id: {${this.valueField}})</i>`
            }
        },
        focus: function (cmp) {
            if (this.secondTime) return;

            let store = cmp.getStore();
            let key1 = this.displayField;
            let key2 = this.valueField;

            this.secondTime = true;
            store.on('beforeload', function (store, eOpts) {
                let params = eOpts.params || {};
                let value = params.filter;
                if (!value) delete eOpts.params.filter;
                else {
                    eOpts.params.filter = JSON.stringify({
                        $or: [
                            {[key1]: {$like: `%${value}%`}},
                            {[key2]: {$like: `%${value}%`}}
                        ]
                    });
                }
            });
        }
    }
});