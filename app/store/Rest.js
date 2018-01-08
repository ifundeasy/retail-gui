Ext.define('Axp.store.Rest', {
    extend: 'Ext.data.Store',
    model: 'Axp.model.Rest',
    listeners: {
        beforesync: function (options, eOpts) {
            let writerCols = this.writer;
            for (let mod in options) {
                let list = options[mod];
                list.forEach(function (obj) {
                    let data = {_: obj.data._};
                    writerCols.forEach(function (el) {
                        data[el.name] = obj.data[el.name] || '';
                    });
                    obj.data = data;
                })
            }
        }
    }
});