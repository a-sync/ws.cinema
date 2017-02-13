// {{{
function AchexLogo(canvas_s,size,color, offset){
	var self = this;
    this.offset_space = 0;
    if( offset != null){
        this.offset_space = offset;
    }
	this.canvas = canvas_s;
	this.ctx = self.canvas.getContext('2d');
	this.size=size;
	this.blurr=10;
	this.tog=0;
	this.glow=0;
	this.color1='#37a';
	this.color2='#269';
	if(color != null){
		if(color.c1 != null){this.color1=color.c1;}
		if(color.c2 != null){this.color2=color.c2;}
	}

	this.draw_diamond= function(ctx,size,x,y,fillstyle){
		ctx.beginPath();
		ctx.moveTo(x,y-size/2);//up
		ctx.lineTo(x-size/2,y+size*.15);//left
		ctx.lineTo(x,y+size/2);//down
		ctx.lineTo(x+size/2,y+size*0.15);//right
		ctx.lineTo(x,y-size/2);//top
		//ctx.strokeStyle = 'rgba(0,0,0,0)';
		ctx.fillStyle=fillstyle;
		ctx.closePath();
		ctx.fill();
		//ctx.stroke();
	};

	this.draw_half_diamond = function(ctx,size,x,y,fillstyle,half){
		ctx.beginPath();
		ctx.moveTo(x,y-size/2);//up
		if(half==1)
			ctx.lineTo(x-size/2,y+size*.15);//left
		ctx.lineTo(x,y+size/2);//down
		if(half==0)
			ctx.lineTo(x+size/2,y+size*0.15);//right
		ctx.lineTo(x,y-size/2);//top
		//ctx.strokeStyle = 'rgba(0,0,0,0)';
		ctx.fillStyle=fillstyle;
		ctx.closePath();
		ctx.fill();
		//ctx.stroke();
	};

	this.draw = function(cx,cy){
		self.ctx.clearRect(0,0,self.ctx.canvas.width,self.ctx.canvas.height);
		self.ctx.shadowColor='#fff';
		self.ctx.shadowBlur=self.blurr;
		self.ctx.shadowOffsetX='0';
		self.ctx.shadowOffsetY='0';

		self.draw_diamond(self.ctx,self.size, cx,cy+self.size/2, self.color1);
		self.draw_half_diamond(	self.ctx,self.size,    cx,cy+self.size/2, self.color2, 0);
		self.draw_diamond(self.ctx,self.size*.66, cx,cy+self.size/2 , 'white');
		self.draw_diamond(self.ctx,self.size*.25, cx,cy+self.size*.55 , self.color1);
		self.draw_half_diamond(	self.ctx,self.size*.25,cx,cy+self.size*.55 , self.color2, 1);
	};

	this.drawFitToCanvas = function(color, fadeout){ 
		if( color != null ){
			if( color.c1 != null ){ self.color1=color.c1; };
			if( color.c2 != null ){ self.color2=color.c2; };
		}
		self.size = Math.min(self.ctx.canvas.width-self.offset_space,self.ctx.canvas.height-self.offset_space);
        //console.log(self.offset_space);
		//self.size = Math.min(self.ctx.canvas.width, self.ctx.canvas.height);
        if(fadeout){
            $('#'+self.canvas.id).css('opacity',  1);
        }
		self.drawInCenter();
        if(fadeout){
            $('#'+self.canvas.id).stop().animate({'opacity': 0},3000);
        }
	};
	this.drawInCenter= function(){ 
		self.draw(self.ctx.canvas.width/2,self.ctx.canvas.height/2-self.size/2);
	};
	this.resizeCanvas = function(w,h){
		if(w == null){ w = self.size;}
		if(h == null){ h = self.size;}
		self.ctx.canvas.width = w;
		self.ctx.canvas.height= h;
	};

	this.setBlurr = function(blr){
		self.blurr=blr;
	};

	this.blink = function(maxblurr,minblurr){
		if(maxblurr == null){maxblurr=10;}
		if(minblurr == null){minblurr=7;}
		if(self.tog==1){
			self.blurr +=1;
		}else{
			self.blurr -=1;
		}
		if(self.blurr > maxblurr){self.tog=0}else if(self.blurr < minblurr){self.tog=1;}
		//if(self.glow==1){setTimeout(self.blink,120);}else{self.blurr=10;}
	};

	this.getImg = function(){
		return self.canvas.toDataURL();
	};
}
// }}}

function AchexWs(obj) 
{
    this.dbg = (obj.dbg == 1) ? true:false;
    this.port = (obj.port != null) ? obj.port : 4010;
    this.reconnect = (obj.reconnect != null) ? obj.reconnect : 3000;

    this.url = (obj.url != null) ? obj.url : 'ws://www.achex.ca';

    this.fade = (obj.fade != null) ? obj.fade : true;

	this.callback =(obj.callback != null) ? obj.callback : null;
	this.opencallback = (obj.opencallback != null) ? obj.opencallback : null;
	this.service = obj.service;

	this.ready= false;
	this.isReady = function(){return this.ready;};
	this.isConnected = function(){return this.ready;};
	var self=this;
	this.sid=-1;
	this.username = '';
    this.password = 'none';

	this.clearToConnect = false;
	if( obj.username != null && obj.username != '' && obj.password != null && obj.password != '' ){
		this.username = obj.username;
        this.password = obj.password;
		this.clearToConnect = true;
	}

	// CANVAS && LOGO {{{
	if(obj.logo == null){
		this.canvas= document.createElement('canvas');
		this.canvas.style.position='absolute';
		this.canvas.style.top='5px';
		this.canvas.style.right='5px';
		this.canvas.id= this.username+'wst';
		this.logo_size = 50;
		this.canvas.width = this.logo_size;
		this.canvas.height = this.logo_size;
        if( document.getElementsByTagName('body')[0] != null ){
            document.getElementsByTagName('body')[0].appendChild(this.canvas);
        }
		this.logo = new AchexLogo( this.canvas, this.logo_size, null, 10 );
		this.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
	}else{
		this.canvas = document.getElementById(obj.logo.canvas);
        if(obj.logo.size == null){
            this.logo_size = 50;
        }else{
            this.logo_size = obj.logo.size;
        }
        if(obj.logo.soffset == null){
            this.logo = new AchexLogo( this.canvas, this.logo_size, null, 10 );
        }else{
            this.logo = new AchexLogo( this.canvas, this.logo_size, null, obj.logo.soffset );
        }
		this.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
    }
	// CANVAS && LOGO }}}

	// dbg
	//this.ctx = this.canvas.getContext('2d');
	//this.ctx.fillRect(0,0,20,20);

	this.identify_timeout = {};
	this.ws={};
	this.connect = function(){
		self.reconnect_flag = true;
		self.ws = new WebSocket(self.url + ':'+ self.port);
		self.ws.onopen = function(){
			if(console.log)console.log('opened ws');
			self.logo.drawFitToCanvas({c1:'#090',c2:'#070'});
			if(self.service){
				self.ws.send('{"serverSetID":"'+self.username+'","passwd":"'+self.password+'"}');
				self.identify_timeout = setTimeout(
						function(){
						self.ws.send('{"setID":"'+self.username+'","passwd":"'+self.password+'"}');
						},1000);
			}else{
				self.ws.send('{"setID":"'+self.username+'","passwd":"'+self.password+'"}');
			}
		};
		self.ws.onclose= function(){
			self.ready=false;
			self.sid=-1;
			if(console.log)console.log('closed ws');
			self.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
            if( self.reconnect_flag && !isNaN( self.reconnect ) ){
                setTimeout(function(){
                    self.connect();
                }, self.reconnect);
            }
        };
		self.ws.onmessage = function(e){
			// dbg
            if(self.dbg){
                if(console.log)console.log(e.data);
            }
			// dbg
			try{
				var rcv = JSON.parse(e.data);
				if(rcv.SID != null && self.sid == -1 && rcv.FROM == null){
					self.sid = rcv.SID;
				}else if(rcv.auth != null && rcv.FROM == null){
					if(rcv.auth=='ok'){
						clearTimeout(self.identify_timeout);
						if(console.log)console.log('connected ws');
						self.logo.drawFitToCanvas({c1:'#37a',c2:'#269'}, self.fade);
						self.ready=true;
						if(self.opencallback != null){
							self.opencallback();
						}
					}
				}else if(rcv.ltcy != null && rcv.FROM == null){
					self.ping = rcv.ltcy;
				}else{
					if(self.callback != null){
						self.callback(rcv, e.data);
					}
				}
			}catch(err){
                if(console.log)console.log('no json object');
                if(self.callback != null){
                    self.callback( null, e.data );
                }
			}
		};
		self.ws.onerror = function(e){
			self.ready=false;
			self.sid=-1;
			if(console.log)console.log('err:');
			if(console.log)console.log(e);
			self.logo.drawFitToCanvas({c1:'#800',c2:'#700'});
		};
	};
	if(this.clearToConnect){
		this.connect();
	}

    this.send_buf = [];
    this.sendPending = function(){
        if(self.sid != -1 && self.ready){
            for(var i=0; i< self.send_buf.length; i++){
                if(self.send_buf[i] != ''){
                    self.ws.send(self.send_buf[i]); // ws_send
                    if(console.log)console.log('sending:' + self.send_buf[i]);
                }
            }
            self.send_buf = [];
        }else{
            setTimeout(self.sendPending,1000);
        }
    };

    this.send = function(str)
    {
        var tosend = '';
        if(typeof(str) == 'object'){
            tosend = JSON.stringify(str);

        }else if(typeof(str) == 'string'){
            tosend = str;
        }

        if(self.sid != -1 && self.ready){
            if(tosend != ''){
                self.ws.send(tosend);
            }
        }else{
            if(console.log)console.log('WARN - WS NOT READY');
            self.send_buf.push(tosend);
            setTimeout(self.sendPending,1000);
        }
    };

    this.close = function()
    {
        self.reconnect_flag = false;
        self.ready = false;
        if( self.closecallback != null ){
            self.closecallback();
        }
        if( self.sid != -1 ){
            self.ws.close();
        }
    };
}




( function ( $ ) {
	$.achex= function(obj) {
        this.achex = new AchexWs(obj);
	};
}( jQuery ) );

// vim:tabstop=4:sw=4:softtabstop=4:ft=cpp:expandtab fdm=marker foldmarker={{{,}}}
