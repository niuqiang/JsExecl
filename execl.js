/**
 * Created by Administrator on 2015/10/23.
 */
// ʱ�� 2015��10��21��19:52:23


var JsExecl = JsExecl || {};
/**
 * ���� ���̳� ��minix �� ����
 * @param name
 *    if name eq String ����һ������
 *       else �����̳е���
 * @param extend type String
 * @param minix
 * @param config
 * @constructor
 */
function Class(name, extend, mixins, config) {

    this.className = name;


    function maktor() {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }

        return constructor;
    };


    var tmp = maktor();
    var tmpPrototpye = tmp.prototype;

    if (arguments.length == 4) {

        var F = function () {
        }, superclassProto = extend.prototype;

        F.prototype = superclassProto;


        for (var i in  F.prototype) {

            tmpPrototpye[i] = F.prototype[i];

        }

    }


    for (var i in config) {

        tmpPrototpye[i] = config[i];

    }

    window[name] = tmp;
}

JsExecl.DomHelp = function () {

    this.aa = function (a) {

        console.log(a);
    }
}


JsExecl.Component = {};


Class('Button', JsExecl.Component, [], {
    cls: 'button',
    array: [],
    values: {},
    appendTo: function (el) {


        Execljs.DomHelper.append(el, Execljs.DomHelper.createTemplate(this.tpl), this.values);
    },

    constructor: function (tpl) {
        this.tpl = tpl;

        return this;
    }


});

var tpl = '<div class="inputmenuGroup">' +
    '   <input type="text" style="font-family: Consolas" class="input buttoninput  fonttype" value="Consolas"/>' +
    '  <span class="lsf arrow">dropdown</span>' +
    '</div>';
var t = new Button(tpl);

t.appendTo('toolbar');
console.log(t);



