// Copyright (c) 2019 sidev-jp
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php
'use strict';

const UkComp = {
    UkSearch: (function(){
        /*
        option sample
        {
            id:"search",        -> 必須項目
            style:"default",    -> default, large
            icon:{
                id:"",          -> 未使用
                tag:"span",     -> span, button, a
                flip: false     -> true:検索アイコンを右側に配置, false:左側に配置
            },
            input:{
                id: "",         -> 未使用
                placeholder:"Search..."
            }
        }
        */
        const cl = function(option){
            if (util.tname(option) != "object") return new Error("Set Object for the parameter");
            if (!option.id) return new Error("Set id for the option.id");
            if (!(this instanceof UkComp.UkSearch)) return new UkComp.UkSearch(option);
            this.option = option;
            if (!this.option.style) this.option.style = "default";
            
            let opt;
            if (!this.option.icon) this.option.icon = {};
            opt = this.option.icon;
            if (!opt.id) opt.id = "";
            if (!opt.tag) opt.tag = "span";
            if (!opt.flip) opt.flip = false;
    
            if (!this.option.input) this.option.input = {};
            opt = this.option.input;
            if (!opt.id) opt.id = "";
            if (!opt.placeholder) opt.placeholder = "";
        };
        const p = cl.prototype;
        p.render = function(){
            const form = document.getElementById(this.option.id);
            if (!form.classList.contains("uk-search")) form.classList.add("uk-search");
            if (this.option.style == "default") {
                if (!form.classList.contains("uk-search-default")) form.classList.add("uk-search-default");
                if (form.classList.contains("uk-search-large")) form.classList.remove("uk-search-large");
            } else if (this.option.style == "large") {
                if (form.classList.contains("uk-search-default")) form.classList.remove("uk-search-default");
                if (!form.classList.contains("uk-search-large")) form.classList.add("uk-search-large");
            }
            this.search = form;
    
            let icon = form.getElementsByTagName("span");
            if (icon.length == 0) icon = form.getElementsByTagName("button");
            if (icon.length == 0) icon = form.getElementsByTagName("a");
            icon = icon[0];
            if (!icon) {
                icon = document.createElement(this.option.icon.tag);
                icon.setAttribute("uk-search-icon", "");
                form.appendChild(icon);
            }
            if (this.option.icon.flip && !icon.classList.contains("uk-search-icon-flip")) icon.classList.add("uk-search-icon-flip");
            this.icon = icon;
    
            let input = form.getElementsByTagName("input")[0];
            if (!input) {
                input = document.createElement("input");
                input.type = "search";
                form.appendChild(input);
            }
            if (this.option.input.placeholder) input.setAttribute("placeholder", this.option.input.placeholder);
            if (!input.classList.contains("uk-search-input")) input.classList.add("uk-search-input");
            this.input = input;
        };
        p.toString = function(){
            return this.id;
        };
        return cl;
    })()

    ,UkList: (function(){
        /*
        option sample
        {
            id:"list",          -> 必須項目
            style:"",           -> 空文字, bullet, divider, striped
            data:{"1":{name:"aa", ...}, "2":{name:"aa", ...}},  -> 表示対象のデータ
            // 表のレコードの追加、変更時のイベントハンドラ
            // ・liの追加、変更時にliひとつに付き1回callされる
            // ・function内のthisは追加、変更対象のliを指す
            // id - liのid属性値
            // data - option.dataの1行分
            onrecord:function(id, data){
                this.innerHTML = data.name;
            }
        }
        ※data
        　・keyにはliのidを指定。
        　・value部分はフリーフォーマット
        */
        const cl = function(option){
            if (util.tname(option) != "object") return new Error("Set Object for the parameter");
            if (!option.id) return new Error("Set id for the option.id");
            if (!(this instanceof UkComp.UkList)) return new UkComp.UkList(option);
            this.option = option;
            if (!this.option.style) this.option.style = "";
            if (!this.option.data) this.option.data = {}; // {liのid:{1レコード分のデータ}, ...}
            if (!this.option.onrecord) this.option.onrecord = function(id, data){this.innerHTML = data;};
        };
        const p = cl.prototype;
        p.render = function(){
            const ul = document.getElementById(this.option.id);
            if (!ul.classList.contains("uk-list")) ul.classList.add("uk-list");
            if (this.option.style == "") {
                if (ul.classList.contains("uk-list-bullet")) ul.classList.remove("uk-list-bullet");
                if (ul.classList.contains("uk-list-divider")) ul.classList.remove("uk-list-divider");
                if (ul.classList.contains("uk-list-striped")) ul.classList.remove("uk-list-striped");
    
            } else if (this.option.style == "bullet") {
                if (!ul.classList.contains("uk-list-bullet")) ul.classList.add("uk-list-bullet");
                if (ul.classList.contains("uk-list-divider")) ul.classList.remove("uk-list-divider");
                if (ul.classList.contains("uk-list-striped")) ul.classList.remove("uk-list-striped");
    
            } else if (this.option.style == "divider") {
                if (ul.classList.contains("uk-list-bullet")) ul.classList.remove("uk-list-bullet");
                if (!ul.classList.contains("uk-list-divider")) ul.classList.add("uk-list-divider");
                if (ul.classList.contains("uk-list-striped")) ul.classList.remove("uk-list-striped");
    
            } else if (this.option.style == "striped") {
                if (ul.classList.contains("uk-list-bullet")) ul.classList.remove("uk-list-bullet");
                if (ul.classList.contains("uk-list-divider")) ul.classList.remove("uk-list-divider");
                if (!ul.classList.contains("uk-list-striped")) ul.classList.add("uk-list-striped");
            }
            this.list = ul;
    
            const lis = ul.children;
            const wlis = {};
            // this.option.data内に無い要素をul.childrenからremoveする
            // ついでにupdate対象を連想配列に退避
            for (let i=0, max=lis.length; i<max && lis[i] !== undefined; ++i) {
                if (this.option.data[lis[i].id] !== undefined) wlis[lis[i].id] = lis[i];
                else {ul.removeChild(lis[i]); --i;}
            }
            let li;
            for (let v in this.option.data) {
                if (wlis[v] === undefined) {
                    // 追加
                    li = document.createElement("li");
                    li.id = v;
                    this.option.onrecord.call(li, v, this.option.data[v]);
                    ul.appendChild(li);
                } else {
                    // 更新
                    this.option.onrecord.call(wlis[v], v, this.option.data[v]);
                }
            }
            util.domsort("#" + ul.id + " li", function(v){return v.id;});
        };
        p.toString = function(){
            return this.id;
        };
        return cl;
    })()
};
