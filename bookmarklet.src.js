function f(d){
    var v = d.getElementsByTagName('video');
    for(var i in v)
        if(v[i].readyState > 0 && !v[i].paused) {
            prompt('Copy video source URL', v[i].currentSrc);
            return false
        }
    return true
}
if(f(window.document)&&window.frames.length>0){
    for(var c = 0; window.frames.length > c && f(window.frames[c].document);)
        c++
}

//mini: 
function f(e){var r=e.getElementsByTagName("video");for(var n in r)if(r[n].readyState>0&&!r[n].paused)return prompt("Copy video source URL",r[n].currentSrc),!1;return!0}if(f(window.document)&&window.frames.length>0)for(var c=0;window.frames.length>c&&f(window.frames[c].document);)c++;