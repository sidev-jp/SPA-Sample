// Copyright (c) 2019 sidev-jp
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php
'use strict';
const util = {
    // ES3でのクラスの継承を行う
    // sub - サブクラス
    // sup - スーパークラス
    inherits: function (sub, sup) {
        sub.super_ = sup;
        const F = function F () {};
        F.prototype = sup.prototype;
        sub.prototype = new F();
        sub.prototype.constructor = sub;
    }
    // 型名を取得する
    ,tname: function (v) {
        return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
    }
    // 指定dom配下のdomをソートする
    // selector - 「#aaa li」のように親要素>子要素と指定すること。子要素がソート対象となる
    // conv - ソート対象domを数値表現に変換するfunctionを指定
    ,domsort: function (selector, conv) {
      const sel = selector.split(' ');
      const con = document.querySelector(sel[0]);
      [].slice.call(con.querySelectorAll(sel[1]))
      .map(function(v){
        return {dom: v, value: conv(v)-0};
      })
      .sort(function(a,b){return a.value - b.value;})
      .forEach(function(v){con.appendChild(v.dom);});
    }
    // 正規表現のメタ文字をエスケープする
    ,regEscape: function (v){
      const reg = /[\\^$.*+?()[\]{}|]/g;
      return (v && reg.test(v)) ? v.replace(reg, '\\$&') : v;
    }
    // ブラウザの最優先の言語を取得
    ,language: function (){
      if (typeof window == 'undefined') return undefined;
      return (window.navigator.languages && window.navigator.languages[0]) ||
              window.navigator.language ||
              window.navigator.userLanguage ||
              window.navigator.browserLanguage;
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = util;
