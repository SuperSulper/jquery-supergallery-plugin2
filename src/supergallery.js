(function($){
	var Supergallery = function(target,_o){
		_o = _o || {};
		this.o = {
			selectors:{
				main:'.main',					//メイン画像が入っている要素のセレクタ
				thumb:'.thumb',					//サムネイルが入っている要素のセレクタ	
				nextBtn:'.nextBtn',				//「次へ」ボタン用のセレクタ
				prevBtn:'.prevBtn',				//「前へ」ボタン用のセレクタ
				indicator:'.indicator'			//ページインジケーター用のセレクタ
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
				selectedClassName:'selected',	//選択されている時につけておくサムネイル・ページインジケーター用のクラス
				loop:true						//最後の要素まで行ったら最初に戻るかどうか
			}
		};
		$.extend(true,this.o,_o);

		this.$target = $(target).data(this);
		this.$main = this.$target.find(this.o.selectors.main);
		this.$mainChildren = this.$main.children();
		this.$thumb = this.$target.find(this.o.selectors.thumb);
		this.$thumbChildren = this.$thumb.children();
		this.$indicator = this.$target.find(this.o.selectors.indicator);
		this.$indicatorChildren = this.$indicator.children();
		this.$nextBtn = this.$target.find(this.o.selectors.nextBtn);
		this.$prevBtn = this.$target.find(this.o.selectors.prevBtn);
		this.current = null;
		this.timerId = null;
		this.num = this.$mainChildren.length;
		this.init();
	};

	Supergallery.prototype.init = function(){
		var sg = this,eventType = ('ontouchend' in window) ? 'touchend' : 'click';

		if(!sg.$main.length){
			throw 'mainの数が0個です。セレクタが間違っているかもしれません。 this.o.selectors.main : ' + sg.o.selectors.main;
		}
		if(!this.$mainChildren.length){
			throw 'mainの中に何もありません！';
		}


		sg.$main
			.css({
				position:'relative',
				overflow:'hidden'
			});
		sg.$mainChildren
			.css({
				position:'absolute'
			})
			.eq(sg.o.other.initialSelect)
				.css({display:'block'})
			.end()
			.not(':eq(' +sg.o.other.initialSelect+ ')')
				.css({display:'none'});

		sg.changeTo(sg.o.other.initialSelect,true);
		if(sg.$thumbChildren.length){
			sg.$thumbChildren
				.each(function(n){
					$(this)
						.on(eventType,function(){
							sg.changeTo(n);
						});
				});
		}
		if(sg.$indicatorChildren.length){
			sg.$indicatorChildren
				.each(function(n){
					$(this)
						.on(eventType,function(){
							sg.changeTo(n);
						});
				});
		}
		if(sg.$nextBtn.length){
			sg.$nextBtn.on(eventType,function(){
				var target = sg.current + 1;
				if(target < sg.num){
					sg.changeTo(target);
				}else{
					if(sg.o.other.loop){
						sg.changeTo(0);
					}
				}
			});
		}
		if(sg.$prevBtn.length){
			sg.$prevBtn.on(eventType,function(){
				var target = sg.current - 1;
				if(target >= 0){
					sg.changeTo(target);
				}else{
					if(sg.o.other.loop){
						sg.changeTo(sg.num - 1);
					}
				}
			});
		}

		if(sg.o.timer.enable && sg.o.timer.interval){
			sg.setTimer();
		}
		if(sg.o.timer.enable && sg.o.timer.interval && sg.o.timer.stopOnHover){
			sg.$target
				.hover(function(){
					sg.clearTimer();
				},function(){
					sg.setTimer();
				});
		}
		return this;
	};
	Supergallery.prototype.changeTo = function(n,noAnimation){
		var sg = this;
		if(n === sg.current){ return false;}
		sg.$target.trigger('pageChangeStart',n);
		var duration = noAnimation ? 0 :sg.o.animation.duration;
		var oldNum = sg.current;
		var $_target = sg.$mainChildren.eq(n),$_oldTarget = sg.$mainChildren.eq(oldNum);

		if(sg.o.animation.type === 'fade'){
			$_target
				.stop(true,false)
				.fadeTo(duration,1);
			if(oldNum !== null){
				$_oldTarget
				.stop(true,false)
				.fadeTo(duration,0,function(){
					$(this).css({display:'none'});
					sg.$target.trigger('pageChangeEnd',n);
				});
			}
		}else if(sg.o.animation.type === 'slide'){
			var startPos = $_target.width() * ((oldNum < n) ? 1 : -1);
			var endPos = $_oldTarget.width() * ((oldNum < n) ? -1 : 1);
			if(noAnimation){
				$_target
					.css({
						left:0,
						display:'block'
					});
				if(oldNum !== null){
					$_oldTarget
						.css({
							display:'none'
						});
				}
			}else{
				$_target
				.css({
					left:startPos,
					display:'block'
				})
				.stop(true,false)
				.animate({
					left:0
				},duration,sg.o.animation.easing);
				$_oldTarget
					.stop(true,false)
					.animate({
						left:endPos
					},duration,sg.o.animation.easing,function(){
						$_oldTarget
							.css({
								display:'none'
							});
						sg.$target.trigger('pageChangeEnd',n);
					});
			}
		}

		sg.$indicatorChildren
			.eq(n)
				.addClass(sg.o.other.selectedClassName)
			.end()
			.not(':eq('+ n +')')
				.removeClass(sg.o.other.selectedClassName);

		sg.$thumbChildren
			.eq(n)
				.addClass(sg.o.other.selectedClassName)
			.end()
			.not(':eq(' + n + ')')
				.removeClass(sg.o.other.selectedClassName);
		sg.current = n;
	};

	Supergallery.prototype.setTimer = function(){
		var sg = this;
		if(sg.timerId){
			sg.clearTimer();
		}
		sg.timerId = setInterval(function(){
			var target = sg.current + 1;
			if(target < sg.num){
				sg.changeTo(target);
			}else{
				if(sg.o.other.loop){
					sg.changeTo(0);
				}else{
					sg.clearTimer();
				}
			}
		},sg.o.timer.interval);
	};

	Supergallery.prototype.clearTimer = function(){
		clearInterval(this.timerId);
	};

	var core = {
		supergallery:function(targetSelector,_o){
			return new Supergallery(targetSelector,_o);
		},
		superThumbGallery:function(targetSelector,_o){
			_o = _o || {};
			var o = {
				selectors:{
					main:'.mainHolder',
					thumbPages:'.thumbHolder',
					thumbBtns:'.thumbBtn',
					selected:'selected'
				},
				thumbNum:5,
				main:{
					selectors:{
						thumb:''
					},
					timer:{
						enable:true
					}
				},
				thumb:{
					selectors:{
						main:'.thumbPages',
						thumb:'',
						nextBtn:'',
						prevBtn:''
					},
					animation:{
						type:'slide'
					},
					timer:{
						enable:false
					}
				}
			};
			$.extend(true,o,_o);
			var mainSelector = [targetSelector,o.selectors.main].join(' ');
			var thumbPagesSlector = [targetSelector,o.selectors.thumbPages].join(' ');

			var main = $.supergallery(mainSelector,o.main);
			var thumbPages = $.supergallery(thumbPagesSlector,o.thumb);
			var $_thumbBtns = $([targetSelector,o.selectors.thumbPages,o.thumb.selectors.main,o.selectors.thumbBtns].join(' '));

			$(mainSelector)
				.on('pageChangeStart',function(e,num){
					thumbPages.changeTo(Math.floor(num / o.thumbNum));
					$_thumbBtns
						.eq(num)
							.addClass(o.selectors.selected.replace('.',''))
						.end()
						.not(':eq('+ num +')')
							.removeClass(o.selectors.selected.replace('.',''));
				});

			$(targetSelector)
				.hover(function(){
					main.clearTimer();
				},function(){
					main.setTimer();
				});

			$_thumbBtns
				.each(function(n){
					$(this).click(function(){
						main.changeTo(n);
					});
				});
			return {
				main:main,
				thumbPages:thumbPages
			};
		}
	};

	var fn = {
		supergallery:function(_o){
			$(this)
				.each(function(){
					new Supergallery(this,_o);
				});
			return this;
		}
	};
	$.extend(core);
	$.fn.extend(fn);
})(jQuery);