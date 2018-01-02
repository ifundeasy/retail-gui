Ext.define('Axp.controller.master.Product', {
    extend: 'Ext.app.Controller',
    views: ['master.Product'],
    init: function () {
        console.log('INIT', this.$className)
    }
});