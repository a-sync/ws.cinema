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
    var self=this;
    this.dbgSetID = (obj.dbgSetID === undefined? false : true);
    this.achexFbAuthObj = (obj.achexFbAuthObj!==undefined)?obj.achexFbAuthObj : null;
    this.facebook = obj.facebook||false;
    this.dbg = (obj.dbg === undefined) ? false:true;
    this.port = (obj.port !== undefined) ? obj.port : null;
    this.reconnect = obj.reconnect||3000;

    this.url = obj.url||'wss://cloud.achex.ca';

    this.callback =(typeof( obj.callback ) === 'function') ? obj.callback : function(){console.log('default callback handler')};
    this.opencallback = (typeof(obj.opencallback) === 'function') ? obj.opencallback : function(){console.log('default opencallback handler')};
    this.closecallback = (typeof(obj.closecallback) === 'function') ? obj.closecallback: function(){console.log('default closecallback handler')};

    this.ready= false;
    this.isReady = function(){return this.ready;};
    this.isConnected = function(){return this.ready;};
    this.sid=-1;
    this.sID = function(){return self.sid;};
    this.username = '';
    this.password = 'none';

    this.clearToConnect = false;
    if( obj.username != null && obj.username != '' && obj.password != null && obj.password != '' ){
        this.username = obj.username;
        this.password = obj.password;
        this.clearToConnect = true;
    }else{
        if ( !obj.username )
        {console.error('Achex API: Input object does not contain "username" parameter');}
        if ( !obj.password )
        {console.error('Achex API: Input object does not contain "password" parameter');}
    }
    if( obj.facebook && this.achexFbAuthObj.authToken != '' && this.achexFbAuthObj.userID != '' && this.achexFbAuthObj.authfacebook != '')
    {
        this.clearToConnect = true;
    }

    if( obj.autoconnect === false ){
        this.clearToConnect=false;
    }

    // CANVAS && LOGO {{{

    if( obj.logo === undefined ){
        // default LOGO
        this.canvas= document.createElement('canvas');
        this.canvas.style.position='absolute';
        this.canvas.style.top='5px';
        this.canvas.style.right='5px';
        this.canvas.id= 'jqueryAchexWssLogo';
        this.logo_size = 50;
        this.canvas.width = this.logo_size;
        this.canvas.height = this.logo_size;
        if( document.getElementsByTagName('body')[0] != null ){
            document.getElementsByTagName('body')[0].appendChild(this.canvas);
        }
        this.logo = new AchexLogo( this.canvas, this.logo_size, null, 10 );
        this.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
    }else{
        // LOGO
        this.canvas = document.getElementById(obj.logo.canvas);
        if( !this.canvas ){
            this.canvas= document.createElement('canvas');
            this.logo_size = 50;
            this.canvas.width = this.logo_size;
            this.canvas.height = this.logo_size;
        }
        this.logo_size = obj.logo.size||50;
        this.fade = obj.logo.fade||true;
        this.logo = new AchexLogo( this.canvas, this.logo_size, null, obj.logo.soffset||10);
        this.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
    }
    // CANVAS && LOGO }}}

    this.identify_timeout = {};
    this.ws={};
    this.connect = function(){
        self.reconnect_flag = true;
        if( self.port !== null ){
            self.ws = new WebSocket(self.url + ':'+ self.port);
        }else{
            self.ws = new WebSocket(self.url);
        }
        self.ws.onopen = function(){
            console.log('opened ws "'+ self.url+'"');
            self.logo.drawFitToCanvas({c1:'#090',c2:'#070'});

            if( self.facebook )
            {
                console.log('Achex Cloud - Facebook Auth');
                self.ws.send(JSON.stringify(self.achexFbAuthObj));
            }else if(self.dbgSetID){
                console.log('Achex Cloud - setID');
                self.ws.send('{"setID":"'+self.username+'","passwd":"'+self.password+'"}');
            }else{
                console.log('Achex Cloud - Auth');
                self.ws.send('{"auth":"'+self.username+'","passwd":"'+self.password+'"}');
            }
        };
        self.ws.onclose= function(){
            self.ready=false;
            self.sid=-1;
            console.log('closed ws');
            self.logo.drawFitToCanvas({c1:'#bbb',c2:'#aaa'});
            if( self.reconnect_flag && !isNaN( self.reconnect ) ){
                setTimeout(function(){
                    self.connect();
                }, self.reconnect);
            }
            self.closecallback(); 
        };
        self.ws.onmessage = function(e){
            // dbg
            if(self.dbg){
                console.log('Recv:',e.data);
            }
            // dbg
            try{
                // get JSON 
                var rcv = JSON.parse(e.data);
                // Check if need auth
                if ( self.sid > -1 ) 
                {// Normal Operation 
                    if ( rcv.ltcy && rcv.sID === undefined )
                    {// Message from Server
                        // ping
                        self.ping = rcv.ltcy;
                    }
                    try{
                        self.callback(rcv, e.data); 
                    }catch(e){
                        console.warn('Callback Function Error!');
                        console.error(e);
                    }
                }else if( (self.sid == -1) && (rcv.SID || rcv.auth)&&( 
                            rcv.sID     === undefined && 
                            rcv.FROM    === undefined &&
                            rcv.joinHub === undefined && 
                            rcv.leaveHub=== undefined ))
                {// AUTH
                    self.sid = (Number.isInteger(rcv.SID)? rcv.SID : -1);
                    if(rcv.auth.toLowerCase() == 'ok') {
                        clearTimeout(self.identify_timeout);
                        self.logo.drawFitToCanvas({c1:'#37a',c2:'#269'}, self.fade);
                        self.ready=true;
                        console.log('Achex WSS ready');
                        self.opencallback(); 
                    }
                }
            }catch(err){
                console.warn('Achex Protocol Error - sent bad JSON/Binary to server\nServer Response:\n  "' + e.data+'"');
                console.error(err);
            }
        };
        self.ws.onerror = function(e){
            self.ready=false;
            self.sid=-1;
            console.log('err:');
            console.log(e);
            self.logo.drawFitToCanvas({c1:'#800',c2:'#700'});
        };
    };
    this.join = function(hub){
        this.send({joinHub:hub});
    };
    this.send_buf = [];
    this.sendPending = function(){
        if(self.sid != -1 && self.ready){
            for(var i=0; i< self.send_buf.length; i++){
                if(self.send_buf[i] != ''){
                    self.ws.send(self.send_buf[i]); // ws_send
                    console.log('sending:' + self.send_buf[i]);
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
                if(self.dbg)
                {
                    console.log('Send:',tosend);
                }
            }
        }else{
            console.log('WARN - WS NOT READY');
            self.send_buf.push(tosend);
            setTimeout(self.sendPending,1000);
        }
    };

    this.close = function()
    {
        self.reconnect_flag = false;
        self.ready = false;
        if( self.sid != -1 ){
            self.ws.close();
        }
    };

    if( this.clearToConnect ){
        this.connect();
    }
}

/*==============================================*/
function DisplayFacebookLoginModal(display=true)
{
    if( display )
    {
        if(!$('body').length) { document.write('<body></body>'); }
        $('<div id="achexFbLoginModal"><div><canvas id="achexLogoFbLogin"></canvas><div class="acpltxt">Achex Platform Login</div><div id="achexfblogbutton"></div></div></div>').css({
            backgroundColor: 'rgba(51,119,170,0.7)'
                ,position: 'fixed'
                ,top:0
                ,left:0
                ,zIndex: 99
                ,width:'100%'
                ,height:'100%'
                ,textAlign:'center'
                ,display:'table'
        }).appendTo('body');
        $('#achexFbLoginModal>div').css({
            display:'table-cell'
                ,verticalAlign:'middle'
        });
        $('.acpltxt').css({
            color:'#fff'
                ,fontFamily:'monospace'
                ,fontSize:'20px'
                ,margin:'10px'
        });
        var sym = new AchexLogo($('#achexLogoFbLogin')[0], Math.floor(window.innerWidth/2), null,10);
        sym.drawFitToCanvas();
        $('#FbButton').appendTo('#achexfblogbutton');
    }else{
        $('#achexFbLoginModal').remove();
    }
}

function checkLoginState() 
{
    console.log('check fb login state');
    FB.getLoginStatus(function(response){
        if( response.status ==='connected' )
        {
            DisplayFacebookLoginModal(false);
            $.achex.achexFbAuthObj = {
                authToken : response.authResponse.accessToken,
                userID : response.authResponse.userID
            };
            //this.achex = new AchexWs(obj);
            // check response data

            FB.api('/me', function(response) {
                $.achex.achexFbAuthObj.authfacebook = response.name;
                var obj = jQuery.achexdata;
                obj.achexFbAuthObj = $.achex.achexFbAuthObj;
                this.achex = new AchexWs(obj);
            });
        }else{
            DisplayFacebookLoginModal(true);
        }
    });
}
/*==============================================*/


( function ( $ ) {
    $.achex = function(obj) {
        if ( obj.facebook === true )
        {
            this.achexdata = obj;
            //console.log('Getting script');
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '1765202877069955',
                    cookie    : true,  // enable cookies to allow the server to access the session
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.8' // use graph api version 2.8
                });
                checkLoginState();
            };
            $(document).ready(function(){
                $('body').prepend('<fb:login-button id="FbButton" scope="public_profile,email" onlogin="checkLoginState();"></fb:login-button>');
                $.getScript('https://connect.facebook.net/en_US/sdk.js',function(){
                        console.log('Got SCript');
                        checkLoginState();
                        });
            });
        }else{
            this.achex = new AchexWs(obj);
        }
    };
}( jQuery ) );

// vim:tabstop=4:sw=4:softtabstop=4:ft=cpp:expandtab fdm=marker foldmarker={{{,}}}