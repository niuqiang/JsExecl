/**
 * Created by Administrator on 2015/10/23.
 */
// 时间 2015年10月21日19:52:23


var Execljs = Execljs || {};

/**
 * 基础 ，继承 ，minix ， 配置
 * @param name
 *    if name eq String 创建一个该类
 *       else 创建继承的类
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
    for (var j in mixins) {

        var mixinsPro = mixins[j].prototype;

        for (var y in mixinsPro)
            tmpPrototpye[y] = mixinsPro[y];
    }

    for (var i in config) {

        tmpPrototpye[i] = config[i];

    }

    window[name] = tmp;
}

Execljs.Component = {};


Execljs.onReady(function () {

    Class('Button', Execljs.Component, [Event.EventManager], {
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

    t.on('click', function () {
        alert('sds');
    })
    console.log(t);
})





