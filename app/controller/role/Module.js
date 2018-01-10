Ext.define('A.controller.role.Module', {
    extend: 'Ext.app.Controller',
    views: ['role.Module'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});