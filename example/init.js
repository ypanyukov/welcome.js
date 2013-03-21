var welcome, btn;
Tools.ready(function(){
    welcome = new w();
    btn = document.querySelector('#welcome_action');
    Tools.addEvent(btn, "click", function(){
        welcome.moveTo(1);
    });    
})