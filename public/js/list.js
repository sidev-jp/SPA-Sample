// Copyright (c) 2019 sidev
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php
'use strict';

/*
option sample
{
	id:"search",
	url:"http://xxxxx/api/sample/search",  -> 検索処理のアクセス先(非同期)
	pos: 0,								   -> 検索開始位置
	max: 50,							   -> 最大データ取得件数
	// 検索成功時のイベントハンドラ
	// ・検索処理の成功時に1回callされる
	//   onsearchedの処理が完了するまで次の検索処理イベントは発火されない
	// ・function内のthisは検索のトリガーとなったdomを指す
	//   Search.executeで直接検索実行した場合はSearch自身を指す
	// res - レスポンス情報
	// option - Search生成時に渡したoption
	onsearched: function (res, option) {
		list.render();
	}
}
*/
const Search = (function(){
	const cl = function(option){
		if (!(this instanceof Search)) return new Search(option);
		Search.super_.call(this, option);
		this.state = Search.STANDBY;
		option.pos = (option.pos && option.pos > 0) ? option.pos : 0;
		option.max = (option.max && option.max > 0) ? option.max : 50;
		this.prev = {        // 前回の検索キー
			pos: undefined,
			key: undefined,
			max: undefined
		};
	};
	util.inherits(cl, UkComp.UkSearch);
	cl.STANDBY = 1;
	cl.SEARCHING = 2;
	cl.RECEIVED = 3;
	const p = cl.prototype;
	p.execute = function(key, obj){
		if (this.option.onsearched && this.state == Search.STANDBY) {
			this.prev.pos = this.option.pos;
			this.prev.key = key;
			this.prev.max = this.option.max;
			const query = {
				pos: this.option.pos,
				key: key,
				max: this.option.max
			};

			const my = this;
			if (!obj) obj = my;
			$.ajax({
				url:this.option.url,
				type:"GET",
				dataType: "json",
				data: query,
				beforeSend: function() {
					my.state = Search.SEARCHING;
				},
			}).done(function( data, textStatus, jqXHR ) {
				my.state = Search.RECEIVED;
				//成功
				my.option.onsearched.call(obj, data, my.option);
			}).fail(function( jqXHR, textStatus, errorThrown) {
				my.state = Search.RECEIVED;
				//失敗
				UIkit.notification({
					message: 'err! - ' + textStatus,
					status: 'danger',
					timeout: 5000
				});
			}).always(function(data){
				my.state = Search.STANDBY;
			});
		}
	};
	p.render = function(){
		Search.super_.prototype.render.call(this);
		const option = this.option;
		const my = this;

        this.icon.onclick = (function(input){return (function(){
			if (my.prev.key === input.value) return;
			option.pos = 0;
			my.execute(input.value, this);
            return false;
		})})(this.input);
		this.input.onkeyup = function(){
			if (my.prev.key === this.value) return;
			option.pos = 0;
			my.execute(this.value, this);
            return false;
		};
    };
	p.toString = function(){
		return Search.super_.prototype.toString.call(this);
	};
	return cl;
})();

/*
option sample
{
	id:"list",
	// 表のスクロールを下部に移動させた際に発生するイベント
	// ・表のスクロールを下部に移動させた際に1回callされる
	//   callされたらステータスがList.STANDBYになるまで次のonnextイベントは発火されない
	// ・function内のthisは表のdom(ul)を表す
	onnext: function () {
		search.option.pos = search.option.pos + search.option.max;
		search.icon.onclick();
	}
}
*/
const List = (function(){
	const cl = function(option){
		if (!(this instanceof List)) return new List(option);
		List.super_.call(this, option);
		this.state = List.STANDBY;
	};
	util.inherits(cl, UkComp.UkList);
	const p = cl.prototype;
	cl.STANDBY = 1;
	cl.RENDERING = 2;
	p.render = function(){
		List.super_.prototype.render.call(this);
		const my = this;
		this.list.onscroll = function(){
			if (!my.option.onnext) {
				// イベント未定義ならステータスは常にSTANDBY
				my.state = List.STANDBY;
				return;
			}

			const lis = this.querySelectorAll("li");
			if (lis.length == 0) {
				my.state = List.STANDBY;
				return;
			}
			const rect = lis[lis.length - 1].getBoundingClientRect();
			if (my.state == List.STANDBY && ((rect.top - (rect.height * 5)) - this.getBoundingClientRect().height) < 0) {
				my.state = List.RENDERING;
				my.option.onnext.call(this);
			}
		};
	};
	p.toString = function(){
		return List.super_.prototype.toString.call(this);
	};
	return cl;
})();

