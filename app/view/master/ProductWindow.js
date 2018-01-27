let navigate = function (panel, direction) {
    let fn = 'get' + direction[0].toUpperCase() + direction.substr(1);
    let layout = panel.getLayout();
    let prev = layout.getPrev();
    let next = layout.getNext();

    layout.getActiveItem().getEl().fadeOut();
    layout[fn]().getEl().fadeIn();
    layout[direction]();

    Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
    Ext.getCmp('move-next').setDisabled(!layout.getNext());
};
Ext.define('A.view.master.ProductWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.productWindow',
    defaultWidth: 600,
    defaultHeight: 400,
    tools: [
        {
            type: 'maximize',
            callback: function (window) {
                let parent = window.up();
                let pos = parent.getPosition();
                let width = parent.getWidth() - 60,
                    height = parent.getHeight() - 60;

                this.hide();
                this.next().show();
                window.setLocalXY(pos[0] + 30, pos[1] + 30, true);
                window.setWidth(width);
                window.setHeight(height);
            }
        },
        {
            type: 'restore',
            hidden: true,
            callback: function (window) {
                let parent = window.up();
                let pos = parent.getPosition();
                let width = parent.getWidth() - window.defaultWidth,
                    height = parent.getHeight() - window.defaultHeight;

                this.hide();
                this.prev().show();
                window.setLocalXY(pos[0] + (width/2), pos[1] + (height/2), true);
                window.setWidth(window.defaultWidth);
                window.setHeight(window.defaultHeight);
            }
        }
    ],
    closable: false,
    resizable: false,
    draggable: false,
    layout: 'card',
    activeItem: 0,
    buttons: [
        {
            id: 'move-prev',
            action: 'back',
            //text: '&#8592;',
            text: 'Prev',
            handler: function (btn) {
                navigate(btn.up("panel"), "prev");
            },
            disabled: true
        },
        {
            id: 'move-next',
            action: 'next',
            //text: '&#8594;',
            text: 'Next',
            handler: function (btn) {
                navigate(btn.up("panel"), "next");
            }
        },
        '->',
        {
            action: 'save',
            text: 'Save'
        },
        {
            action: 'close',
            text: 'Close',
            handler: function (btn) {
                btn.up('window').hide()
            }
        },
    ],
    border: false,
    modal: true,
    initComponent: function () {
        let card1 = Ext.create('Ext.panel.Panel', {id: 'card-1', html: 'card-1'});
        let card2 = Ext.create('Ext.panel.Panel', {id: 'card-2', html: 'card-2'});

        this.setWidth(this.defaultWidth);
        this.setHeight(this.defaultHeight);
        Ext.apply(this, {
            items: [card1, card2]
        });
        this.callParent(arguments);
    }
});
