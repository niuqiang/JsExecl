/**
 * Created by Administrator on 2015/11/13.
 */


Element = function (element) {

    var me = this,
        dom = typeof  element == 'string'
            ? document.getElementById(element)
            : element,
        id;

    me.el = me;
    me.dom = dom;

    return me;
}

Element.prototype = {

    constructor: Element,

    on: function (type, fn) {

        Event.EventManager.event.add(this.dom, type, fn);

    },

    getWidth: function () {
        var me = this,
            dom = me.dom;

        return dom.clientWidth ;


    },

    getHeight: function () {
    },


    setWidth: function () {
    },

    setHeight: function () {
    },

    addCls: function (cls) {

    },

    removeCls: function () {

    },

    getXY: function () {


    },

    setXY: function () {

    },

    setStyle: function (prop, value) {

        var me = this,
            dom = me.dom;

        me.dom.style[prop] = value;

        return me;

    },

    getStyle: function (prop, value) {

        var me = this,
            dom = me.dom;

        return  me.dom.style[prop].replace('px','')  ;



    },


    findParent: function (simpleSelector, limit, returnEl) {

        var target = this.dom;
        target = target.parentNode;
        return new Element(target);
    }

}

Element.get = function (id) {

     return  new Element(id);
}


Element.getElByCls = function (el, cls ,out ) {

    var children = el.children, tmp,cl,element;


    if (children && children.length > 0) {

        for ( cl in children) {

            tmp = children[cl];

            if (tmp.className && tmp.className.indexOf(cls) > -1) {


                out.push(new Element(tmp));

            } else {

                Element.getElByCls(tmp, cls ,out);
            }

        }

    }


}