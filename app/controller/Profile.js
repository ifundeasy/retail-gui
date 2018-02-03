Ext.define('A.controller.Profile', {
    extend: 'Ext.app.Controller',
    views: ['Profile', 'ChangePassword'],
    refs: [
        {ref: 'passwordWindow', selector: 'masterProfile changePassword'},
        {ref: 'suggestVillage', selector: 'masterProfile suggestbox[prop="village"]'},
        {ref: 'gridAddress', selector: 'masterProfile grid[prop="personAddress"]'},
        {ref: 'fieldName', selector: 'masterProfile [name=name]'},
        {ref: 'fieldGender', selector: 'masterProfile [name=gender]'},
        {ref: 'fieldUsername', selector: 'masterProfile [name=username]'},
        {ref: 'saveBtn', selector: 'masterProfile button[todo=save]'},
        {ref: 'changePassBtn', selector: 'masterProfile button[todo=change]'}
    ],
    events: {
        'masterProfile ': {
            afterrender: 'afterrender'
        },
        'masterProfile suggestbox[prop="village"]': {
            select: 'choosedVillage'
        },
        'masterProfile tabpanel': {
            afterrender: 'afterrenderTabpanel'
        },
        'masterProfile grid dataview': {
            refresh: 'refreshView'
        },
        'masterProfile grid toolbar button[todo="add"]': {
            click: 'addRow'
        },
        'masterProfile grid toolbar button[todo="delete"]': {
            click: 'deleteRows'
        },
        'masterProfile button[todo=save]': {
            click: 'clickSaveBtn'
        },
        'masterProfile component[todo=triggerWindow]': {
            afterrender: 'triggerWindow'
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
                            national_name: state.national_name
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
            PersonActor, PersonAddress, PersonContact, PersonSession
        } = me.stores;

        me.getFieldName().setValue(data.name);
        me.getFieldGender().setValue(data.gender);
        me.getFieldUsername().setValue(data.username);

        PersonActor.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonContact.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonSession.setFilter({person_id: id}).Sort('id', 'DESC');
        PersonAddress.setFilter({person_id: id}).Sort('id', 'DESC');
    },
    afterrender: async function (window) {
        let me = this;
        let userId = me.application.backend.data.user.id;
        let {
            Contact, Actor, Status, Village,
            District, Regency, State, Person, PersonAddress
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
        });

        await Person.Filter({id: userId});

        let record = Person.getAt(0);
        me.params = {record, store: record.store};
        me.loadData(record)
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
    triggerWindow: function (cmp) {
        let me = this;
        cmp.getEl().on('click', function () {
            me.getPasswordWindow().show()
        });
    },
    clickChangePassBtn: function () {
        console.log('lal')
    },
    clickSaveBtn: async function (btn) {
        let me = this;
        let {Person, PersonAddress, PersonContact} = this.stores;
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
            username: me.getFieldUsername().getValue(),
            gender: me.getFieldGender().getValue()
        });

        if (me.shouldSync(Person)) {
            await Person.Sync();
            await Person.Load();
        }
        if (me.shouldSync(PersonAddress)) {
            await PersonAddress.Sync();
            await PersonAddress.Load();
        }
        if (me.shouldSync(PersonContact)) {
            await PersonContact.Sync();
            await PersonContact.Load();
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

        this.windowCtrl = Ext.create('A.controller.ChangePassword');
        this.windowCtrl.init();
    }
});