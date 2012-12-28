
var Supergallery = function(target,_o){
	_o = _o || {};
	this.o = {
		selectors:{
			main:'.main',
			thumb:'.thumb',
			nextBtn:'.nextBtn',
			prevBtn:'.prevBtn'
		},
		animation:{
			type:'fade',
			duration:400,
			easing:'swing'
		},
		timer:{
			enable:true,
			interval:3000,
			stopOnHover:true
		},
		other:{
			initialSelect:0,
			selectedClassName:'selected',
			loop:true
		}
	};
	$.extend(true,this.o,_o);

	this.$target = $(target);
	this.$main = this.$target.find(this.o.selectors.main);
	this.$mainChildren = this.$main.children();
	this.$thumb = this.$target.find(this.o.selectors.thumb);
	this.$thumbChildren = this.$thumb.children();
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

	}else{
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
var core = function(targetSelector,_o){
	return new Supergallery(targetSelector,_o);
};
var fn = function(_o){
	$(this)
		.each(function(){
			new Supergallery(this,_o);
		});
	return this;
};