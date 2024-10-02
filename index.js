/**
 * ロード
 */
$(function(){
	'use strict';
	
	$('#game').hide();
	$('#win').hide();
	$('#lose').hide();
	$('#index').show();
	
	
	var clickevent = 'click';
	
	$('#easy').on(clickevent, function(){
		event.easy();
	});
	
	$('#normal').on(clickevent, function(){
		event.normal();
	});
	
	$('#hard').on(clickevent, function(){
		event.hard();
	});
	
	$('#veryhard').on(clickevent, function(){
		event.veryhard();
	});
	
	$('#next').on(clickevent, function(){
		event.next();
	});
	
	$('.init').on(clickevent, function(){
		event.init();
	});
});

/**
 * 画面イベント
 */
var event = new function(){
	'use strict';
	
	// 定数
	var 問題数 = 30;
	var 回答中 = 1;
	var 答え表示中 = 2;
	
	// 変数
	var 一問時間 = 0;
	var 何問目 = 0;
	var 一歩距離 = 0;
	
	// 引き算変数
	var 第一項範囲;
	var 第二項範囲;
	
	// たし算変数
	var 足し算桁数 = 1;
	var 二桁目の桁数 = 1;
	
	var カービ移動回数 = 0;
	var デデデ移動回数 = 0;
	
	var 開始時間;
	
	/**
	 * 音楽開始
	 */
	this.startMusic = function(){
		var audio = $('#audio').get(0);
		audio.play();
	};

	/**
	 * 音楽終了
	 */
	this.stopMusic = function(){
		var audio = $('#audio').get(0);
		audio.pause();
		audio.currentTime = 0;
	};
	
	
	/**
	 * かんたん
	 */
	this.easy = function(){
		event.startMusic();
		一問時間 = 5 * 1000;
		
		第一項範囲 = [5, 19];
		第二項範囲 = [1, 9];
		
		足し算桁数 = 1;
		二桁目の桁数 = 1;
		
		event.countDown();
	};
	
	/**
	 * ふつう
	 */
	this.normal = function(){
		event.startMusic();
		一問時間 = 15 * 1000;
		
		第一項範囲 = [10, 50];
		第二項範囲 = [1, 9];
		
		足し算桁数 = 2;
		二桁目の桁数 = 1;
		
		event.countDown();
	};

	/**
	 * むずかしい
	 */
	this.hard = function(){
		event.startMusic();
		一問時間 = 5 * 1000;
		
		第一項範囲 = [1, 99];
		第二項範囲 = [1, 99];
		
		足し算桁数 = 2;
		二桁目の桁数 = 2;
		
		event.countDown();
	};
	
	/**
	 * げきむず
	 */
	this.veryhard = function(){
		event.startMusic();
		一問時間 = 1.7 * 1000;
		
		第一項範囲 = [1, 99];
		第二項範囲 = [1, 99];
		
		足し算桁数 = 2;
		二桁目の桁数 = 2;
		
		event.countDown();
	};
	
	
	/**
	 * カウントダウン開始
	 */
	this.countDown = function() {
		$('#index').hide();
		$('#game').show();
		$('#next').hide();
		$('#answer').hide();
		
		何問目 = 0;
		カービ移動回数 = 0;
		デデデ移動回数 = 0;
		
		開始時間 = new Date();
		
		// 移動距離計算
		一歩距離 = ($('body').get(0).clientWidth - 50) / (問題数 - 1);
		$('#race-kirby').css('left', 0);
		$('#race-dedede').css('left', 0);
		
		var count = 3;
		var text = $('#game-text');
		text.html(count);
		var id = setInterval(function(){
			count--;
			if(count == 0) {
				clearInterval(id);
				event.takeMondai();
				// デデデ走り出す！
				event.runDedede();
			}else {
				text.html(count);
			}
		},1000);
	};
	
	
	/**
	 * 問題を出題する
	 */
	this.takeMondai = function() {
		var n = Math.random();
		
		if(n < 0.33) {
			event.takeMondaiTashizan();
		} else if(n < 0.66) {
			event.takeMondaiHikizan();
		} else {
			event.takeMondaiKakezan();
		}
	};
	
	
	
	/**
	 * たし算出題
	 */
	this.takeMondaiTashizan = function() {
		$('#next').show();
		$('#answer').hide();

		何問目++;
		
		var num1 = Math.floor(Math.random() * (10 ** 足し算桁数));
		var num2 = Math.floor(Math.random() * (10 ** 足し算桁数));
		
		if(足し算桁数 == 2) {
			if(二桁目の桁数 == 1) {
				num2 =  Math.floor(((num2+1) / 10)+1);
			}
		}

		var answer = num1 + num2;
		
		$('#game-text').html(num1 + " ＋ " + num2);
		$('#answer').html(answer);
	};
	
	/**
	 * ひき算出題
	 */
	this.takeMondaiHikizan = function() {
		$('#next').show();
		$('#answer').hide();

		何問目++;
		
		var num1 = Math.floor(Math.random() * (第一項範囲[1] - 第一項範囲[0])) + 第一項範囲[0];
		var num2 = Math.floor(Math.random() * (第二項範囲[1] - 第二項範囲[0])) + 第二項範囲[0];
		
		if(num1 < num2) {
			num2 = Math.floor(Math.random() * num1);
		}
		
		var answer = num1 - num2;
		
		$('#game-text').html(num1 + " － " + num2);
		$('#answer').html(answer);
	};
	
	/**
	 * かけ算出題
	 */
	this.takeMondaiKakezan = function() {
		$('#next').show();
		$('#answer').hide();

		何問目++;
		
		var num1 = Math.floor(Math.random() * (9)) + 1;
		var num2 = Math.floor(Math.random() * (9)) + 1;
		var answer = num1 * num2;
		
		$('#game-text').html(num1 + " × " + num2);
		$('#answer').html(answer);
	};
	
	
	
	/**
	 * つぎへ
	 */
	this.next = function(){

		$('#game-text').hide();
		$('#answer').show();
		$('#next').hide();
		
		// ０．５秒で自動的に次の問題へ
		setTimeout(function(){
			
			$('#game-text').show();
			$('#answer').hide();
			$('#next').show();
			event.moveKirby();
			
			// カービゴール
			if(何問目 >= 問題数) {
				
				// 時間計算
				var 終了時間 = new Date();
				var TimeDefference = 終了時間.getTime() - 開始時間.getTime()

				var Hour = TimeDefference / (1000 * 60 * 60);    
				//「時間」の部分を「Hour」に代入
				var Minute = (Hour - Math.floor(Hour)) * 60;
				//「分」の部分をMinuteに代入
				var Second = (Minute - Math.floor(Minute)) * 60;
				//TimeDefference = (('00' + Math.floor(Hour)).slice(-2) + ':' + ('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
				TimeDefference = (('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
				
				$('.time').html(TimeDefference);

				clearInterval(dededeAnimeId);
				
				if(カービ移動回数 > デデデ移動回数) {
					event.win();
				}else{
					event.lose();
				}
				return;
			}
			
			event.takeMondai();
		}, 500);
	};
	
	
	/**
	 * カービィ前へ
	 */
	this.moveKirby = function(){
		カービ移動回数++;
		$('#race-kirby').css('left', カービ移動回数 * 一歩距離);
	};
	
	// デデデアニメのID（時間数以外でクリアするため）
	var dededeAnimeId;
	/**
	 * デデデ走り出す
	 */
	this.runDedede = function(){
		
		dededeAnimeId = setInterval(function(){
			デデデ移動回数++;
			if(デデデ移動回数 >= 問題数) {
				clearInterval(dededeAnimeId);
				event.lose();
				return;
			}
			$('#race-dedede').css('left', デデデ移動回数 * 一歩距離);
			
			// スローカーブースト
			if(デデデ移動回数 < カービ移動回数 - 2) {
				デデデ移動回数++;
				$('#race-dedede').css('left', デデデ移動回数 * 一歩距離);
			}
		},一問時間);
	};
	
	
	/**
	 * かち
	 */
	this.win = function(){
		event.stopMusic();
		var audio = $('#audio-win').get(0);
		audio.play();
		$('#game').hide();
		$('#win').show();
	};
	
	/**
	 * まけ
	 */
	this.lose = function(){
		event.stopMusic();
		var audio = $('#audio-lose').get(0);
		audio.play();
		$('#game').hide();
		$('#lose').show();
	};
	
	/**
	 * さいしょへ戻る
	 */
	this.init = function(){
		$('#game').hide();
		$('#win').hide();
		$('#lose').hide();
		$('#index').show();
	};
};