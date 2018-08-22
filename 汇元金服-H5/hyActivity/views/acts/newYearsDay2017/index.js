/**
 * Created by Administrator on 2017/12/27.
 */

		var bindEvent = function(){
			$('.my_awads').on('click',function(){
				$(this).fadeOut();
				document.body.parentNode.style.overflowY = "";
			})
			
			$('.calculate_box2').on('click',function(){
				return false;
			})
			
			$('.receive_btn').on('click',function () {
				/*一键领取红包*/
				TL.Ajax({
					type:'get',
			    	url:'receiveRedEnvelope',
			   	}).done(function(data){
			   		$.Alert('领取成功')
			    },function(data){
			    	
		        });
			})
			
			$('#calBtn1').on('click',function () {
				var cycle = $('select option:selected').val();
				var amount = $('.f_left').val();
				if(amount == ''){
					$.Alert('投资金额不能为空');
				}else if(amount < 1000){
					$.Alert('请输入大于1000的金额');
				}else{
					/*计算积分*/
					TL.Ajax({
						type:'get',
				    	url:'integral',
				    	data:{
				    		type:0,
				    		amount:amount,
				    		cycle:cycle,
				    	}
				   	}).done(function(data){
				   		$('#get_in').empty().html(data);
				    },function(data){
				    	
			        });
				}
			})
			
			$('#exchange_btn').on('click',function () {
				var integral = $('.integral').val();
				if(integral == ''){
					$.Alert('请输入要兑换的积分');
				}else if(integral < 120){
					$.Alert('请兑换大于120的积分')
				}else{
					/*兑换现金*/
					TL.Ajax({
						type:'get',
				    	url:'newYear',
				    	data:{
				    		type:1,
				    		integral:integral,
				    	}
				   	}).done(function(data){
				   		$.Alert('兑换现金成功');
				    },function(data){
				    	
			        });
				}
				
			})
			
			$('.prize_item').off('click').on('click',function () {
				var id = $(this).data('id');
				$('#alertModal').fadeIn();
		   		$('#alertBtn1').off('click').on('click',function () {
		   			TL.Ajax({
						type:'get',
				    	url:'newYear',
				    	data:{
				    		type: 0,
				    		id:id,
				    	}
				   	}).done(function(data){
				   		$.Alert('兑换成功,在兑奖记录可查看',function () {
				   			$('#alertModal').fadeOut();
				   		});
				    },function(data){
			   			$('#alertModal').fadeOut();
			        });
		   		})
			})
			/*我的兑奖记录按钮*/
			$('#my_exchange').on('click',function () {
				/*兑奖或取现*/
				TL.Ajax({
					type:'get',
			    	url:'view/yd',
			   	}).done(function(data){
			   		$('.my_awads').fadeIn();
			   		document.body.parentNode.style.overflowY = "hidden";
			   		renderData(data);
			    },function(data){
			    	
		        });
			})
			
			$('#alertBtn2').on('click',function () {
				$('#alertModal').fadeOut();
			})
			
		}
		
		var renderData = function (data) {
			var tpl = [];
			var data = data.logList;
			
			if(!data.length){
				tpl.push('<li>您还没有任何兑奖记录哦~</li>');
			}else{
				data.map(function (v,i) {
					tpl.push('<li>');
					tpl.push('<span>'+v.addTime+'</span>');
					if(v.prizeName == ''){
						tpl.push('<span>无</span>');
					}else{
						tpl.push('<span>'+v.prizeName+'</span>');
					}
					
					if(v.amount == ''){
						tpl.push('<span>无</span>');
					}else{
						tpl.push('<span>'+v.amount+'</span>');
					}
					tpl.push('<span>'+v.integral+'</span>');
					tpl.push('</li>');
				})
			}
			$('#cal_content').empty().append(tpl.join(''));
		}
		
		
		var initIntegral = function () {
			TL.Ajax({
				type:'get',
		    	url:'view/yd',
		   	}).done(function(data){
		   		
		   		TL.checkLogin(function (){
					$('.score').empty().html('登录后可见');
					$('#surplus').empty().html('登录后可见');
					$('.score').on('click',function () {
						TL.toLogin();
					})
		        },function () {
		       		$('.score').empty().html(data.total);
		       		$('#surplus').empty().html(data.surplus);
                    $.Alert('【温馨提示：积分兑换截止日期已延长至2月4日24:00】');
			　　	})
		    },function(data){

	        });
		}
		
		var fun = function () {
			var integral = $('.integral').val();
			console.log(integral)
			/*兑奖或取现*/
			TL.Ajax({
				type:'get',
		    	url:'integral',
		    	data:{
		    		type:1,
		    		integral:integral,
		    	}
		   	}).done(function(data){
		   		$('#money').empty().html(data)
		    },function(data){
		    	
	        });
		}
		
   	var initPage = function(){
		bindEvent();
		initIntegral();
	}
       	
	$(function(){
		TL.judePlatform(function(){
				initPage();
			},
			{
				native:function(){
					window.nativeInit = function () {//必须使用这样的方式
						initPage();
					};
	
					lrNative.toAppGetArgs();//获取鉴权参数
				},
				wechat:function () {
					initPage();
				}
		});
	});
