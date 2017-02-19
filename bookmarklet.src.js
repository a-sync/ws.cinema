function f(w){
    try{
		var v = w.document.getElementsByTagName('video');
    	for(var i in v)
        	if(v[i].readyState > 0 && !v[i].paused){
            	prompt('Copy video source URL:', v[i].currentSrc);
            	return false
        	}
    } catch(e){}
    return true
}
if(f(window)){
    for(var c = 0; c < window.frames.length && f(window.frames[c]);)c++;
    if(c >= window.frames.length){
        var i = window.document.querySelector('iframe[allowfullscreen]');
        var t = "Can't detect currently playing video.";
        if(i) {
            if(confirm(t+' Retry inside iframe?')) window.location.href = i.src
        }
        else alert(t)
    }
}


//mini: 
function f(e){try{var r=e.document.getElementsByTagName("video");for(var t in r)if(r[t].readyState>0&&!r[t].paused)return prompt("Copy video source URL:",r[t].currentSrc),!1}catch(i){}return!0}if(f(window)){for(var c=0;c<window.frames.length&&f(window.frames[c]);)c++;if(c>=window.frames.length){var i=window.document.querySelector("iframe[allowfullscreen]"),t="Can't detect currently playing video.";i?confirm(t+" Retry inside iframe?")&&(window.location.href=i.src):alert(t)}}


//bookmarklet:
javascript:(function()%7Bfunction%20f(e)%7Btry%7Bvar%20r%3De.document.getElementsByTagName(%22video%22)%3Bfor(var%20t%20in%20r)if(r%5Bt%5D.readyState%3E0%26%26!r%5Bt%5D.paused)return%20prompt(%22Copy%20video%20source%20URL%3A%22%2Cr%5Bt%5D.currentSrc)%2C!1%7Dcatch(i)%7B%7Dreturn!0%7Dif(f(window))%7Bfor(var%20c%3D0%3Bc%3Cwindow.frames.length%26%26f(window.frames%5Bc%5D)%3B)c%2B%2B%3Bif(c%3E%3Dwindow.frames.length)%7Bvar%20i%3Dwindow.document.querySelector(%22iframe%5Ballowfullscreen%5D%22)%2Ct%3D%22Can't%20detect%20currently%20playing%20video.%22%3Bi%3Fconfirm(t%2B%22%20Retry%20inside%20iframe%3F%22)%26%26(window.location.href%3Di.src)%3Aalert(t)%7D%7D%7D)()