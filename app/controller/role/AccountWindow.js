Ext.define('A.controller.role.AccountWindow', {
    extend: 'Ext.app.Controller',
    views: ['role.AccountWindow'],
    refs: [
        {ref: 'window', selector: 'accountWindow'},
        {ref: 'suggestVillage', selector: 'accountWindow suggestbox[prop="village"]'},
        {ref: 'gridAddress', selector: 'accountWindow grid[prop="personAddress"]'},
        {ref: 'fieldName', selector: 'accountWindow [name=name]'},
        {ref: 'fieldGender', selector: 'accountWindow [name=gender]'},
        {ref: 'fieldStatus', selector: 'accountWindow [name=status_id]'},
        {ref: 'saveBtn', selector: 'accountWindow button[action=save]'},
        {ref: 'closeBtn', selector: 'accountWindow button[action=close]'},
        {ref: 'nextBtn', selector: 'accountWindow button[action=next]'},
        {ref: 'prevBtn', selector: 'accountWindow button[action=prev]'},
    ],
    events: {
        'accountWindow ': {
            afterrender: 'afterrender',
            show: 'show'
        },
        'accountWindow suggestbox[prop="village"]': {
            select: 'choosedVillage'
        },
        'accountWindow button[action=save]': {
            click: 'clickSaveBtn'
        },
        'accountWindow button[action=close]': {
            click: 'clickCloseBtn'
        },
        'accountWindow button[action=next]': {
            click: 'clickNextBtn'
        },
        'accountWindow button[action=prev]': {
            click: 'clickPrevBtn'
        },
        'accountWindow tabpanel': {
            afterrender: 'afterrenderTabpanel'
        },
        'accountWindow grid dataview': {
            refresh: 'refreshView'
        },
        'accountWindow grid toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'accountWindow grid toolbar button[todo="delete"]': {
            click: 'deleteRows'
        }
    },
    choosedVillage: async function (cmp, records) {
        let {District, Regency, State} = this.stores;
        let grid = cmp.up('grid');
        let plugin = grid.editingPlugin || grid.normalGrid.editingPlugin;
        let record = plugin.activeRecord;
        let data = records[0];
        let district_id = data.get('district_id');
        if (district_id) {
            await District.setFilter({id: district_id}).Sort('id', 'DESC');

            if (District.getAt(0)) {
                let district = District.getAt(0).getData();

                record.set({
                    district_id: district.id,
                    district_name: district.name
                });
                await Regency.setFilter({id: district.regency_id}).Sort('id', 'DESC');

                if (Regency.getAt(0)) {
                    let regency = Regency.getAt(0).getData();

                    record.set({
                        regency_id: regency.id,
                        regency_name: regency.name
                    });
                    await State.setFilter({id: regency.state_id}).Sort('id', 'DESC');

                    if (State.getAt(0)) {
                        let state = State.getAt(0).getData();

                        record.set({
                            state_id: state.id,
                            state_name: state.name,
                            national_id: state.national_id,
                            natinal_name: state.natinal_name
                        });
                    }
                }

            }
        }
    },
    loadData: async function (record) {
        let me = this;
        let id = record.get('id');
        let data = record.getData();
        let {
            Person, PersonActor, PersonAddress, PersonContact, PersonSession
        } = this.stores;

        me.getWindow().setTitle(`Person: "${data.name}"`);
        me.getFieldName().setValue(data.name);
        me.getFieldGender().setValue(data.gender);
        me.getFieldStatus().setValue(data.status_id);

        PersonActor.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonContact.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonSession.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonAddress.setFilter({person_id: id}).Sort('id', 'DESC');
    },
    afterrender: async function (window) {
        let me = this;
        let {
            Contact, Actor, Status, Village,
            District, Regency, State, PersonAddress
        } = me.stores = window.stores;

        Contact.Load();
        Actor.Load();
        Status.Load();
        Village.Load();
        PersonAddress.on('load', async function (store, records) {
            let finder = function (store, valueId) {
                let index = store.findExact('id', valueId);
                return store.getAt(index).data;
            };
            if (!store.data.keys.length) return;
            let districtIds = [];
            let villageIds = records.map(function (rec) {
                districtIds.push(rec.get('village_district_id'));
                return rec.get('village_id')
            });
            if (districtIds.length) {
                await District.setFilter({id: {$in: districtIds}}).Sort('id', 'DESC');

                let regencyIds = District.data.items.map(function (rec) {
                    return rec.get('regency_id')
                });
                if (regencyIds.length) {
                    await Regency.setFilter({id: {$in: regencyIds}}).Sort('id', 'DESC');

                    let stateIds = Regency.data.items.map(function (rec) {
                        return rec.get('state_id')
                    });
                    if (stateIds.length) {
                        await State.setFilter({id: {$in: stateIds}}).Sort('id', 'DESC');
                    }

                }
            }

            records.forEach(function (rec) {
                let district = finder(District, rec.get('village_district_id'));
                let regency = finder(Regency, district.regency_id);
                let state = finder(State, regency.state_id);
                rec.set({
                    district_id: district.id,
                    district_name: district.name,
                    regency_id: regency.id,
                    regency_name: regency.name,
                    state_id: state.id,
                    state_name: state.name,
                    national_id: state.national_id,
                    national_name: state.national_name
                });
            });
        })
    },
    show: async function (window) {
        let parent = window.up();
        let pos = parent.getPosition();
        let width = parent.getWidth() - 20,
            height = parent.getHeight() - 20;

        window.setLocalXY(pos[0] + 10, pos[1] + 10, true);
        window.setWidth(width);
        window.setHeight(height);

        if (this.params.record.get('id')) {
            let {index, record, store} = this.params;
            let {pageSize, totalCount, currentPage} = store;
            let nextBtn = this.getNextBtn();
            let prevBtn = this.getPrevBtn();

            store.realIdx = pageSize * (currentPage - 1) + index;
            window.setTitle(`Account: "${this.params.record.get('name')}"`);

            nextBtn.setDisabled(totalCount === store.realIdx + 1);
            prevBtn.setDisabled(store.realIdx === 0);
            this.loadData(record);
        } else {
            window.setTitle('Add New Account');
            this.getPrevBtn().setDisabled(1);
            this.getNextBtn().setDisabled(0);
        }
    },
    afterrenderTabpanel: function (elm, eOpts) {
        let element = Ext.query('#' + elm.tabBar.id + ' div[id$=innerCt]')[0];
        element.style.backgroundColor = '#fff';
    },
    shouldSync: function (store, list) {
        let should = [];
        if (store.removed.length) should.push(true);
        store.each(function (rec) {
            if (!rec.get('id')) should.push(true);
            else should.push(rec.dirty);
        });

        this.shouldSave.push(should.indexOf(true) > -1);
        return (should.indexOf(true) > -1)
    },
    clickSaveBtn: async function (btn) {
        let me = this;
        let {Person, PersonActor, PersonAddress, PersonContact, PersonSession} = this.stores;
        let person = me.params.record;
        let id = person.get('id');
        let configMsg = {
            title: 'Save Account',
            msg: 'Nothing to be saved!',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING
        };

        btn.setDisabled(1);

        me.shouldSave = [];
        person.set({
            name: me.getFieldName().getValue(),
            gender: me.getFieldGender().getValue(),
            status_id: me.getFieldStatus().getValue()
        });

        if (me.shouldSync(Person)) {
            me.getWindow().setTitle(`Person: "${me.getFieldName().getValue()}"`);
            await Person.Sync();
            await Person.Load();
        }
        if (me.shouldSync(PersonActor)) {
            await PersonActor.Sync();
            await PersonActor.Load();
        }
        if (me.shouldSync(PersonAddress)) {
            await PersonAddress.Sync();
            await PersonAddress.Load();
        }
        if (me.shouldSync(PersonContact)) {
            await PersonContact.Sync();
            await PersonContact.Load();
        }
        if (me.shouldSync(PersonSession)) {
            await PersonSession.Sync();
            await PersonSession.Load();
        }

        let saveAny = me.shouldSave.indexOf(true) > -1;

        if (saveAny) {
            configMsg.icon = Ext.Msg.INFO;
            configMsg.msg = 'Saving success';
            await Person.Load();
        }

        Ext.Msg.show(configMsg);
        btn.setDisabled(0);
    },
    clickCloseBtn: function () {
        this.getWindow().hide();
    },
    clickNextBtn: async function () {
        let me = this;
        let {index, store} = me.params;
        let nextIdx = index + 1;
        let {pageSize, totalCount, currentPage} = store;

        if (store.getAt(nextIdx)) {
            me.params.index = nextIdx;
            me.params.record = store.getAt(nextIdx);
            me.params.store = me.params.record.store;
            me.params.store.realIdx += 1;
        } else if (Math.round(totalCount / pageSize) > currentPage) {
            await store.NextPage();
            me.params.index = 0;
            me.params.record = store.getAt(0);
            me.params.store = me.params.record.store;
            me.params.store.realIdx += 1;
        }

        if (me.params.store.totalCount - 1 === me.params.store.realIdx) {
            this.getNextBtn().setDisabled(1);
        }
        if (me.params.store.realIdx) {
            this.getPrevBtn().setDisabled(0);
        } else {
            this.getPrevBtn().setDisabled(1);
        }

        me.loadData(me.params.record)
    },
    clickPrevBtn: async function () {
        let me = this;
        let {index, store} = me.params;
        let prevIdx = index - 1;
        let {realIdx, pageSize, totalCount, currentPage} = store;

        if (prevIdx > -1 && store.getAt(prevIdx)) {
            me.params.index = prevIdx;
            me.params.record = store.getAt(prevIdx);
            me.params.store = me.params.record.store;
            me.params.store.realIdx -= 1;
        } else if (realIdx > -1) {
            await store.PreviousPage();
            me.params.index = pageSize - 1;
            me.params.record = store.getAt(pageSize - 1);
            me.params.store = me.params.record.store;
            me.params.store.realIdx -= 1;
        }

        if (me.params.store.realIdx === 0) {
            this.getPrevBtn().setDisabled(1);
        }
        if (me.params.store.getAt(me.params.store.realIdx + 1)) {
            this.getNextBtn().setDisabled(0);
        } else {
            this.getNextBtn().setDisabled(1);
        }

        me.loadData(me.params.record)
    },
    refreshView: function (dataview) {
        if (dataview.panel) {
            Ext.each(dataview.panel.columns, function (column) {
                if (column.autoSizeColumn === true) {
                    try {
                        column.autoSize();
                        column.setWidth(column.width +  5)
                    } catch (e) {
                        //
                    }
                }
            })
        }

    },
    addRow: async function (btn, event) {
        let me = this;
        let person_id = me.params.record.get('id');
        let grid = btn.up('grid');
        let store = grid.getStore();
        let rec = store.insert(0, {person_id});
        let plugin = grid.plugins[0] || grid.lockedGrid.plugins[0];
        plugin.startEditByPosition({
            row: rec[0],
            column: 2
        });
    },
    deleteRows: function (btn) {
        let grid = btn.up('grid');
        let {items} = grid.getSelectionModel().selected;
        if (items.length) {
            Ext.Msg.show({
                title: 'Confirm',
                msg: 'Delete multiple, ' + items.length + ' items. This action will take effect when you save a data.',
                buttons: Ext.MessageBox.YESNO,
                closeable: false,
                icon: Ext.Msg.QUESTION,
                animateTarget: btn,
                fn: function (choose) {
                    if (choose === 'yes') {
                        grid.getStore().remove(items);
                    }
                }
            });
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
    }
});