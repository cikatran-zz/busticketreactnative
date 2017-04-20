'use strict';

import Realm from 'realm';

class Departure extends Realm.Object {}
  Departure.schema = {
    name: 'Departure',
    properties: {
        code: 'string',
        name: 'string',
        normalizedname: 'string'
    },
};

class Destination extends Realm.Object {}
  Destination.schema = {
    name: 'Destination',
    properties: {
        code: 'string',
        name: 'string',
        normalizedname: 'string'
    },
};

class DepartureList extends Realm.Object {}
  DepartureList.schema = {
    name: 'DepartureList',
    properties: {
        departures: {type: 'list', objectType: 'Departure'},
    },
};

export default new Realm({schema: [Departure, DepartureList, Destination], schemaVersion: 0});
