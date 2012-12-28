
var Supergallery = function(target,_options){
	_options = _options || {};
	this.options = {
		selectors:{
			main:'#main',
			thumb:'#thumb',
			nextBtn:'#nextBtn',
			prevBtn:'#prevBtn'
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
	$.extend(true,this.options,_options);
	this.$target = $(target);
	this.$main = this.$target.find(this.options.selectors.main);
	this.$mainChildren = this.$main.children();
	this.$thumb = this.$target.find(this.options.selectors.thumb);
	this.$thumbChildren = this.$thumb.children();
	this.$nextBtn = $(this.options.selectors.nextBtn);
	this.$prevBtn = $(this.options.selectors.prevBtn);
	this.current = null;
	this.timerId = null;
	this.num = this.$mainChildren.length;
	this.init();
};

Supergallery.prototype.init = function(){
	var sg = this,eventType = ('ontouchend' in window) ? 'touchend' : 'click';

	if(!this.$main.length){
		throw 'mainの数が0個です。セレクタが間違っているかもしれません。 this.options.selectors.main : ' + this.options.selectors.main;
	}
	if(!this.$mainChildren.length){
		throw 'mainの中に何もありません！';
	}


	this.$main
		.css({
			position:'relative',
			overflow:'hidden'
		});
	this.$mainChildren
		.css({
			position:'absolute'
		})
		.eq(this.options.other.initialSelect)
			.css({display:'block'})
		.end()
		.not(':eq(' +this.options.other.initialSelect+ ')')
			.css({display:'none'});

	this.changeTo(this.options.other.initialSelect,true);
	if(this.$thumbChildren.length){	
		this.$thumbChildren
			.each(function(n){
				$(this)
					.on(eventType,function(){
						sg.changeTo(n);
					});
			});
	}
	if(this.$nextBtn.length){
		this.$nextBtn.on(eventType,function(){
			var target = sg.current + 1;
			if(target < sg.num){
				sg.changeTo(target);
			}else{
				if(sg.options.other.loop){
					sg.changeTo(0);
				}
			}
		});
	}
	if(this.$prevBtn.length){
		this.$prevBtn.on(eventType,function(){
			var target = sg.current - 1;
			if(target >= 0){
				sg.changeTo(target);
			}else{
				if(sg.options.other.loop){
					sg.changeTo(sg.num - 1);
				}
			}
		});
	}

	if(this.options.timer.enable && this.options.timer.interval){
		this.setTimer();
	}
	if(this.options.timer.enable && this.options.timer.interval && this.options.timer.stopOnHover){
		this.$target
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
	if(n === this.current){ return false;}
	this.$target.trigger('pageChangeStart',n);
	var duration = noAnimation ? 0 :this.options.animation.duration;
	var oldNum = this.current;
	var $_target = this.$mainChildren.eq(n),$_oldTarget = this.$mainChildren.eq(oldNum);

	if(this.options.animation.type === 'fade'){
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
			},duration,sg.options.animation.easing);
			$_oldTarget
				.stop(true,false)
				.animate({
					left:endPos
				},duration,sg.options.animation.easing,function(){
					$_oldTarget
						.css({
							display:'none'
						});
					sg.$target.trigger('pageChangeEnd',n);
				});
		}
	}

	this.$thumbChildren
		.eq(n)
			.addClass(this.options.other.selectedClassName)
		.end()
		.not(':eq(' + n + ')')
			.removeClass(this.options.other.selectedClassName);
	this.current = n;
};

Supergallery.prototype.setTimer = function(){
	var sg = this;
	if(this.timerId){
		this.clearTimer();
	}
	this.timerId = setInterval(function(){
		var target = sg.current + 1;
		if(target < sg.num){
			sg.changeTo(target);
		}else{
			if(sg.options.other.loop){
				sg.changeTo(0);
			}else{
				sg.clearTimer();
			}
		}
	},this.options.timer.interval);
};

Supergallery.prototype.clearTimer = function(){
	clearInterval(this.timerId);
};
var core = function(targetSelector,_options){
	return new Supergallery(targetSelector,_options);
}
var fn = function(_options){
	return new Supergallery(this,_options);
};