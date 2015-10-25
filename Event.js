// @tag dom,core
// @require util/Event.js
// @define Execljs.EventManager

/**
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 */
Event.EventManager = new function () {
    var EventManager = this,
        doc = document,
        win = window,
        escapeRx = /\\/g;

    Execljs.apply = function (object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }
        }

        return object;
    };


    Execljs.onReady = function (fn) {

        document.addEventListener("DOMContentLoaded", fn, false);

        // A fallback to window.onload, that will always work
        // window.addEventListener( "load", fn, false );
    }
};


Execljs.DataObj = {
    uid: 1,
    expando: "Execljs" + ( "19870508" + Math.random() ).replace(/\D/g, ""),
    accepts: function (owner) {
        return owner.nodeType ?
        owner.nodeType === 1 || owner.nodeType === 9 : true;
    },
}

Execljs.Data = function () {

    Object.defineProperty(this.cache = {}, 0, {
        get: function () {
            return {};
        }
    });
    this.expando = Execljs.DataObj.expando + "" + Math.random();
}


Execljs.Data.prototype = {
    key: function (owner) {
        if (!Execljs.DataObj.accepts(owner)) {
            return 0;
        }
        var descriptor = {},
            unlock = owner[this.expando];

        if (!unlock) {
            unlock = Execljs.DataObj.uid++;

            // Secure it in a non-enumerable, non-writable property
            try {
                descriptor[this.expando] = {value: unlock};
                Object.defineProperties(owner, descriptor);

                // Support: Android < 4
                // Fallback to a less secure definition
            } catch (e) {
                descriptor[this.expando] = unlock;
                jQuery.extend(owner, descriptor);
            }
        }

        // Ensure the cache object
        if (!this.cache[unlock]) {
            this.cache[unlock] = {};
        }

        return unlock;

    },
    set: function (owner, data, value) {
        var prop,
        // There may be an unlock assigned to this node,
        // if there is no entry for this "owner", create one inline
        // and set the unlock as though an owner entry had always existed
            unlock = this.key(owner),
            cache = this.cache[unlock];

        // Handle: [ owner, key, value ] args
        if (typeof data === "string") {
            cache[data] = value;
        } else {
            for (prop in data) {
                cache[prop] = data[prop];
            }

        }
        return cache;
    },
    get: function (owner, key) {
        // Either a valid cache is found, or will be created.
        // New caches will be created and the unlock returned,
        // allowing direct access to the newly created
        // empty data object. A valid owner object must be provided.
        var cache = this.cache[this.key(owner)];

        return key === undefined ?
            cache : cache[key];
    },
}

console.log(new Execljs.Data());


Event.EventManager.event = {
    data_priv: new Execljs.Data(),
    guid: 1,
    add: function (elem, types, handler) {
        console.log(Execljs.DataObj.data_priv);
        var eventHandle,
            events,
            elemData = this.data_priv.get(elem);

        if (!elemData) {
            return;
        }

        if (!handler.guid) {
            handler.guid = Event.EventManager.guid++;
        }

        // Init the element's event structure and main handler, if this is the first
        if (!(events = elemData.events)) {
            events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function (e) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return Event.EventManager.event.dispatch.apply(eventHandle.elem, arguments);

            };
            // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
            eventHandle.elem = elem;
        }

        // Nullify elem to prevent memory leaks in IE
        elem = null;
    }
    dispatch:

}
Event.EventManager.prototype = {

    on: function (type, fn) {
        Event.EventManager.event.add(this.el, type, fn);

    }

}