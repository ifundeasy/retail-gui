Ext.define('A.controller.role.Actor', {
    extend: 'Ext.app.Controller',
    views: ['role.Actor'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});