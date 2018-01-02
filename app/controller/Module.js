Ext.define('Axp.controller.Module', {
    extend: 'Ext.app.Controller',
    views: ['Module'],
    refs: [
        {ref: 'modules', selector: 'moduleView'},
        {ref: 'contents', selector: 'contentView'},
    ],
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
            node.expanded = true;
            if (node.class) {
                let list = node.class.split('.');
                let cls = list[list.length-1];
                cls = cls[0].toUpperCase() + cls.substr(1);
                list[list.length-1] = cls;
                node.class = 'Axp.controller.' + list.join('.');
                this.application.addController(node.class);
            }
            if (!node.parent || (node.parent && hasChildren.length)) {
                node.leaf = false;
            } else {
                node.leaf = true;
            }
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
    init: function () {
        let me = this;
        let treePanel = me.getModules();
        let tabPanel = me.getContents();
        treePanel.on('cellclick', function (treepanel, td, cellIndex, record, tr, rowIndex, e, eOpts ){
            if (record.raw.class) {
                let viewClass = record.raw.class.replace('Axp.controller', 'Axp.view');
                let exist = tabPanel.items.items.filter(function (e) {
                    return e.$className === viewClass
                })[0];
                if (exist) {
                    tabPanel.setActiveTab(exist);
                } else {
                    exist = Ext.create(viewClass, {
                        title: record.raw.text,
                        layout: 'fit',
                        margins: 30,
                        closable: true
                    });
                    tabPanel.add(exist);
                }
                tabPanel.setActiveTab(exist);
            }
        });
        let data = me.loadModule();
        treePanel.setRootNode(data)
    }
});