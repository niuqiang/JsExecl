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


Class('Button', JsExecl.DomHelp, [], {
    cls: 'button',
    array: [],
    hover: function () {
        console.log(this.cls);
    },
    addButton: function (b) {
        this.array.push(b)
    },
    showButton: function () {
        console.log(this.array);
    },
    click: function () {
    },
    constructor: function () {
        this.a = [];
        this.addButton_ = function (a) {

            this.a.push(a);
        };

        this.showButton_ = function () {
            console.log(this.a);
        };
        return this;
    }


});


var t = new Button();

console.log(t);

t.addButton_('a');
t.addButton('b');
t.addButton('c');

t.aa();