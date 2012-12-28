# jQuery Supergallery Plugin2
Version 1.0.0

Otto Kamiya (MegazalRock)  
mail : otto@mgzl.jp  
twitter : @megazal_rock  
facebook : facebook.com/megazalrock

## 更新履歴
* 1.0.0	InitialRelease


## 概要
Web製作者向けのギャラリープラグインです。

## 必要なライブラリ
[jQuery 1.8+](http://jquery.com/)
## 動作環境
Internet Explorer 7-10(Win)  
Chrome23+(Win/Mac)  
Firefox16+(Win/Mac)  
Opera12+(Win/Mac)  
Safari6+(Mac)

## 含まれているファイル
*	jquery-supergallery-plugin2.js
*	jquery-supergallery-plugin2.min.js

minがついているファイルはminify済みのファイルです。通常はこちらを利用して下さい。

## 使用方法

**目次**
*	[主な使用方法](#main)
*	[その他の使用方法](#sub)
	1. [外部からの操作](#sub_1)
	2. [イベント](#sub_2)

### <a name="main"></a>主な使用方法

HTMLの記述例

	<div id="gallery">
		<ul id="main">
			<li><img src="http://lorempixel.com/g/300/300/city/1/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/2/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/3/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/4/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/5/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/6/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/7/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/8/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/9/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/10/" alt=""></li>
		</ul>
		<ul id="thumb">
			<li><img src="http://lorempixel.com/g/100/100/city/1/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/2/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/3/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/4/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/5/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/6/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/7/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/8/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/9/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/10/" alt=""></li>
		</ul>
		<nav>
			<div id="prevBtn">PREV</div>
			<div id="nextBtn">NEXT</div>
		</nav>
	</div>

Javascriptの記述例（全てデフォルトの設定で動作させる場合）

	$(function(){
		$('#gallery').supergallery();
	});

たったこれだけで、動作させることが可能です。

デフォルトの設定は下記のとおりです。

	{
		selectors:{
			main:'#main',					//メイン画像が入っている要素のセレクタ
			thumb:'#thumb',					//サムネイルが入っている要素のセレクタ	
			nextBtn:'#nextBtn',				//「次へ」ボタン用のセレクタ
			prevBtn:'#prevBtn'				//「前へ」ボタン用のセレクタ
		},
		animation:{
			type:'fade',					//画像の切替アニメーションの種類 (fade:クロスフェード slide:スライド)
			duration:400,					//画像の切替アニメーションのかかる時間
			easing:'swing'					//画像の切替のイージング（プラグイン等で拡張したものも扱えます。）
		},
		timer:{
			enable:true,					//自動めくり機能を有効にする
			interval:3000,					//自動めくりの間隔
			stopOnHover:true				//マウスオーバー時にタイマーを止める
		},
		other:{
			initialSelect:0,				//一番はじめに選択しておく要素のインデックス
			selectedClassName:'selected',	//選択されている時につけておくサムネイル用のクラス
			loop:true						//最後の要素まで行ったら最初に戻るかどうか
		}
	};


### <a name="sub"></a>その他の使用方法

#### <a name="sub_1"></a>外部からの操作
外部からギャラリーを操作することも可能です。その場合は、jQueryのメソッドチェーンではなく、`$.supergallery()`を利用して下さい。  
第一引数に対象となる要素のセレクタ、第二引数にオプションを渡して下さい。

	var gallery = $.supergallery('#gallery',{
		//オプションの指定
	});
	gallery.changeTo(3);	//3ページ目へ変更
	gallery.setTimer();		//現在の自動めくり用タイマーを破棄して、新たにタイマーを設定します。
	gallery.clearTimer();	//現在の自動めくり用タイマーを破棄します。

#### イベント
対象の要素にて、`pageChangeStart` `pageChangeEnd`イベントが発生します。`pageChangeStart`はアニメーション開始時に、`pageChangeEnd`はアニメーション終了時に発生します。	

	$('#gallery')
		.supergallery()
		.on('pageChangeStart',function(e,pageNum){
			//e : jQueryイベントオブジェクト
			//pageNum : ページ番号
		})
		.on('pageChangeEnd',function(e,pageNum){
			//e : jQueryイベントオブジェクト
			//pageNum : ページ番号
		})


## ライセンス
The MIT License
(C) Otto Kamiya (MegazalRock) 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得するすべての人に対し、ソフトウェアを無制限に扱うことを無償で許可します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じことを許可する権利も無制限に含まれます。

上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。

ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、それに限定されるものではありません。 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。