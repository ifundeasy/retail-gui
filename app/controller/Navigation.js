Ext.require('A.store.Rest');
Ext.define('A.controller.Navigation', {
    extend: 'Ext.app.Controller',
    views: ['Navigation'],
    refs: [
        {ref: 'navView', selector: 'navigation'},
        {ref: 'contentView', selector: 'content'}
    ],
    events: {
        'navigation': {
            cellclick: 'onClickModule'
        }
    },
    loadModule: function () {
        let {data} = this.application.backend;
        let modules = Object.assign({}, data.modules);

        data.menus = {
            text: 'Module',
            rootVisible: false,
            expanded: true,
            children: []
        };
        //
        for (let m in modules) {
            let node = modules[m];
            let hasChildren = Object.keys(modules).filter(function (n) {
                if (modules[n].parent === node.id) return 1;
                return 0
            });
            node.text = node.name;
            node.expanded = node.collapsed === '1' ? false : true;
            if (node.class) {
                let list = node.class.split('.');
                let cls = list[list.length - 1];
                cls = cls[0].toUpperCase() + cls.substr(1);
                list[list.length - 1] = cls;
                node.class = 'A.controller.' + list.join('.');
            }
            node.leaf = !node.parent || (node.parent && hasChildren.length) ? false : true;
        }
        for (let m in modules) {
            let node = modules[m];
            if (node.parent) {
                let parent = modules[node.parent];
                parent.children = modules[node.parent].children || [];
                parent.children.push(node);
                parent.children.sort(function (a, b) {
                    return a.seq - b.seq
                })
            } else {
                node.leaf = false;
            }
        }
        for (let m in modules) {
            if (modules[m].parent) {
                delete modules[m];
            } else {
                data.menus.children.push(modules[m])
            }
        }
        return data.menus;
    },
    onClickModule: function (treepanel, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        let me = this;
        let manager = Ext.ClassManager;
        let tabPanel = me.getContentView();
        let controllerCls = record.raw.class;
        //window.localStorage[moduleHistoryKey] = window.localStorage[moduleHistoryKey] || {};
        if (controllerCls) {
            let viewCls = controllerCls.replace('A.controller', 'A.view');
            let listeners = {
                close: function () {
                    me.deleteHistory(viewCls, false)
                }
            };
            let callback = function () {
                let exist = tabPanel.items.items.filter(function (e) {
                    return e.$className === viewCls
                })[0];

                if (!exist) {
                    exist = Ext.create(viewCls, {
                        title: record.raw.text,
                        layout: 'fit',
                        closable: true,
                        border: true,
                        treePanel: {el: treepanel, record},
                        listeners
                    });
                    tabPanel.add(exist);
                }
                tabPanel.setActiveTab(exist);
                tabPanel.doLayout();
                me.writeHistory(viewCls, record.data.id)
            };
            if (!manager.isCreated(controllerCls)) {
                me.application.addController(controllerCls, {callback});
            } else callback();
        }
    },
    readHistory: function (name) {
        let me = this;
        let key = me.historyKey;
        try {
            me.histories = JSON.parse(localStorage[key]);
        } catch (e) {
            me.histories = {};
        }
        return name ? me.histories[name] : me.histories;
    },
    writeHistory: function (name, value) {
        let me = this;
        let key = me.historyKey;
        let history = me.readHistory();
        history[name] = value;
        localStorage[key] = JSON.stringify(history);
    },
    deleteHistory: function (name) {
        let me = this;
        let key = me.historyKey;
        let history = me.readHistory();
        delete history[name];
        localStorage[key] = JSON.stringify(history);
    },
    setModules: function () {
        let me = this;
        let modules = me.loadModule();
        let history = me.readHistory();

        me.getNavView().setRootNode(modules);

        for (let viewCls in history) {
            let value = history[viewCls];
            let node = me.getNavView().getStore().getById(value);
            this.onClickModule(me.getNavView(), 0, 0, node);
        }
    },
    init: function () {
        let me = this;

        for (let query in me.events) {
            let events = me.events[query];
            for (let e in events) {
                let handler = me[events[e]];
                if (handler) events[e] = handler;
                else delete events[e]
            }
        }
        me.control(me.events);
        me.historyKey = me.application.backend.storageKey + '-modules';

        me.setModules();
    },
});