Ext.define('A.controller.report.Sales', {
    extend: 'Ext.app.Controller',
    views: ['report.Sales'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});