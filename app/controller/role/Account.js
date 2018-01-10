Ext.define('A.controller.role.Account', {
    extend: 'Ext.app.Controller',
    views: ['role.Account'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});