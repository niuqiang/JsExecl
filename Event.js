// @tag dom,core
// @require util/Event.js
// @define Execljs.EventManager

/**
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 */
Event.EventManager = new  function () {
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

Event.EventManager = {
    getRelatedTarget:function(e){

        return e ;
    },
    getPageXY:function(e){

        return e ;
    }

}




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

            } catch (e) {
                descriptor[this.expando] = unlock;
                Execljs.apply(owner, descriptor);
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

Event.EventManager.event = {
    data_priv: new Execljs.Data(),
    guid: 1,
    add: function (elem, type, handler) {

        var eventHandle, handlers, handleObj,
            events,
            elemData = this.data_priv.get(elem);

        if (!elemData) {
            return;
        }

        if (!handler.guid) {
            handler.guid = Event.EventManager.event.guid++;
        }


        handleObj = Execljs.apply({
            type: type,
            origType: type,
            handler: handler,
            guid: handler.guid,
            elem: elem
        });

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

            if (!elem.addEventListener) {

                elem.el.addEventListener(type, eventHandle, false);
            } else {
                elem.addEventListener(type, eventHandle, false);

            }
            eventHandle.elem = elem;
        }

        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
        if (!(handlers = events[type])) {
            handlers = events[type] = [];
            handlers.push(handleObj);
        }


        // Nullify elem to prevent memory leaks in IE
        elem = null;
    },
    dispatch: function (event) {

        // Make a writable jQuery.Event from the native event object
        event = Event.EventManager.event.fix(event);

        var i, j, ret, matched, handleObj,
            handlerQueue = [],
            args = [].slice.call(arguments),
            handlers = ( Event.EventManager.event.data_priv.get(this, "events") || {} )[event.type] || []

        args[0] = event;
        event.delegateTarget = this;

        handlerQueue = handlers;

        i = 0;
        while ((matched = handlerQueue[i++])) {
            event.currentTarget = matched.elem;

            j = 0;
            event.handleObj = matched.handler;

            ret = event.handleObj.apply(matched.elem, args);

            if (ret !== undefined) {
                if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
        return event.result;
    },

    fix: function (event) {
        if (event[Execljs.DataObj.expando]) {
            return event;
        }

        // Create a writable copy of the event object and normalize some properties
        var i, prop, copy,
            type = event.type,
            originalEvent = event,

            event = new Event.EventManager.Event(originalEvent);



        // Support: Cordova 2.5 (WebKit) (#13255)
        // All events should have a target; Cordova deviceready doesn't
        if (!event.target) {
            event.target = document;
        }

        // Support: Safari 6.0+, Chrome < 28
        // Target should not be a text node (#504, #13143)
        if (event.target.nodeType === 3) {
            event.target = event.target.parentNode;
        }

        return event;

    },

    trigger: function (event, data, elem, onlyHandlers) {

        var i, cur, tmp, bubbleType, ontype, handle, special,
            eventPath = [elem || document],
            type = {}.hasOwnProperty.call(event, "type") ? event.type : event,
        //     namespaces = {}.hasOwnProperty.call(event, "namespace") ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

        // Don't do events on text and comment nodes
        if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
        }

        ontype = type.indexOf(":") < 0 && "on" + type;

        // Caller can pass in a jQuery.Event object, Object, or just an event type string
        event = event[Execljs.DataObj.expando] ? event : new Event.EventManager.Event(event);

        // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
        event.isTrigger = onlyHandlers ? 2 : 3;

        event.result = undefined;
        if (!event.target) {
            event.target = elem;
        }

        i = 0;
        while ((cur = eventPath[i++])) {


            handle = ( Event.EventManager.event.data_priv.get(cur, "events") || {} )[event.type] && Event.EventManager.event.data_priv.get(cur, "handle");
            if (handle) {
                handle.apply(cur, [event.type]);
            }

        }
        event.type = type;
        return event.result;
    }


}

Event.EventManager.Event = function (src, props) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof Event.EventManager.Event)) {
        return new Event.EventManager.Event(src, props);
    }

    // Event object
    if (src && src.type) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = ( src.defaultPrevented ||
        src.getPreventDefault && src.getPreventDefault() ) ? function () {
            return false
        } : function () {
            return true
        };

        // Event type
    } else {
        this.type = src;
    }

    this.currentTarget =event.currentTarget;

    this.relatedTarget = EventEventManager.getRelatedTarget(event);

    this.xy = EventEventManager.getPageXY(event);


    // Mark it as fixed
    this[Execljs.DataObj.expando] = true;
};

EventEventManager ={

    getRelatedTarget:function(e){

        return e
    },
    getPageXY:function(e){


        event = event.browserEvent || event;
        var x = event.pageX,
            y = event.pageY,
            docEl = document.documentElement,
            body = document.body;

        // pageX/pageY not available (undefined, not null), use clientX/clientY instead
        if (!x && x !== 0) {
            x = event.clientX + (docEl && docEl.scrollLeft || body && body.scrollLeft || 0) - (docEl && docEl.clientLeft || body && body.clientLeft || 0);
            y = event.clientY + (docEl && docEl.scrollTop  || body && body.scrollTop  || 0) - (docEl && docEl.clientTop  || body && body.clientTop  || 0);
        }
        return [x, y];


    }


}





Event.EventManager.prototype = {

    on: function (type, fn) {

        Event.EventManager.event.add(this, type, fn);

    },

    trigger: function (type) {
        Event.EventManager.event.trigger(type, {}, this);

    }

}