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

    return  me;
}

Element.prototype = {
    constructor: Element,

    getWidth: function () {
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

    getXY:function(){


    },

    setXY:function(){

    }

}

Element.get = function (id) {

   //return document.getElementBy
}


Element.getElByCls = function(el , cls){

    var children = el.children, tmp;

    for (var cl in children) {

        tmp = children[cl];
        if (!tmp.className.indexOf(cls)) {
            return tmp.firstChild;
        }
    }

}