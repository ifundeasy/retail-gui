Ext.define('A.controller.Content', {
    extend: 'Ext.app.Controller',
    views: ['Content'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});