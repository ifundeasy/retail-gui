Ext.define('A.controller.master.Brand', {
    extend: 'Ext.app.Controller',
    views: ['master.Brand'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});