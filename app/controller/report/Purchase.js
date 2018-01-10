Ext.define('A.controller.report.Purchase', {
    extend: 'Ext.app.Controller',
    views: ['report.Purchase'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});