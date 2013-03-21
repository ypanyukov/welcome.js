var w = function(config){
    var welcome_node,
        cover,
        tooltip,
        tooltip_number,
        tooltip_text,
        rug_close,
        rug,
        rug_next,
        elements = [],
        currentElement = false,
        nodeElements,
        nextStep = 1,
        _w,
        oldBodyPaddingBottom,
        rugDefaultCSS = {
            rugTop:     0,
            rugLeft:    0,
            rugWidth:   1,
            rugHeight:  1
        },
        rugLastCSS = rugDefaultCSS,
        shows = false;
        
    _w = this;
    
    this.init = function(){
        
        if (!document.querySelectorAll){
            console.log("Method querySelectorAll is not supported");
            return false;
        }
        
        start();
        drawView();
    }
    
    var start = function(){
        nodeElements = document.querySelectorAll('[data-step]');
        for (var e in nodeElements){
            var item = nodeElements[e];
            if (typeof item != "object")
                continue;
            var t = {
                el: item,
                width: Tools.width(item) + Tools.getCSS(item, "margin-left") + Tools.getCSS(item, "margin-right"),
                height: Tools.height(item) + Tools.getCSS(item, "margin-top") + Tools.getCSS(item, "margin-bottom"),
                top: Tools.top(item) - Tools.getCSS(item, "margin-top"),
                left: Tools.left(item) - Tools.getCSS(item, "margin-left")
            }
            elements.push(t);
        }
        
        elements.sort(function(a, b){
            if (typeof a.el != "object" || typeof b.el != "object")
                return;
            if ((a.el.getAttribute("data-step")|0) > (b.el.getAttribute("data-step")|0))
                return 1;
            else if ((a.el.getAttribute("data-step")|0) < (b.el.getAttribute("data-step")|0))
                return -1;
            else
                return 0;
        });
    }
    
    var toDefaultState = function(){
        rugLastCSS = {
            rugTop:     Tools.getCSS(rug, "top"),
            rugLeft:    Tools.getCSS(rug, "left"),
            rugWidth:   Tools.getCSS(rug, "width"),
            rugHeight:  Tools.getCSS(rug, "height")
        }
        
        Tools.setCSS(rug, "width", rugDefaultCSS.rugWidth);
        Tools.setCSS(rug, "height", rugDefaultCSS.rugHeight);
        Tools.setCSS(rug, "left", rugDefaultCSS.rugLeft);
        Tools.setCSS(rug, "top", rugDefaultCSS.rugTop);
    }
    
    var toLastState = function(){
        Tools.setCSS(rug, "width", rugLastCSS.rugWidth);
        Tools.setCSS(rug, "height", rugLastCSS.rugHeight);
        Tools.setCSS(rug, "left", rugLastCSS.rugLeft);
        Tools.setCSS(rug, "top", rugLastCSS.rugTop);
    }
    
    this.show = function(){
        if (shows)
            return;
        
        Tools.setCSS(welcome_node, "display", "block");
        
        oldBodyPaddingBottom = Tools.getCSS(document.body, "padding-bottom");
        Tools.setCSS(document.body, "padding-bottom", Tools.height(tooltip));
        
        toLastState();
        
        shows = true;
    }
    
    this.hide = function(){
        if (!shows)
            return;
            
        Tools.setCSS(welcome_node, "display", "none");
        Tools.setCSS(document.body, "padding-bottom", oldBodyPaddingBottom);
        Tools.removeClass(currentElement.el, "welcomeshowelements");
        
        toDefaultState();
        
        shows = false;
    }
    
    this.nextStep = function(){
        nextStep++;
        this.moveTo(nextStep);
    }
    
    this.moveTo = function(step){
        this.show();
        nextStep = step > elements.length ? 1 : step < 0 ? 1 : step;
        
        if (step > elements.length){
            this.hide();
            return;
        }
        
        if(typeof currentElement == "object")
            Tools.removeClass(currentElement.el, "welcomeshowelements");
            
        currentElement = elements[nextStep - 1];        
        
        if (
            currentElement.top + currentElement.height > window.scrollY + window.innerHeight
            ||
            currentElement.top < window.scrollY
            )
            window.scrollTo(0, currentElement.top - window.innerHeight / 2);
        
        Tools.setCSS(rug, "width", currentElement.width + 40);
        Tools.setCSS(rug, "height", currentElement.height + 40);
        Tools.setCSS(rug, "left", currentElement.left - 20);
        Tools.setCSS(rug, "top", currentElement.top - 20);
        
        tooltip_number.textContent = nextStep;
        tooltip_text.textContent = currentElement.el.getAttribute("data-text");
        Tools.addClass(currentElement.el, "welcomeshowelements");
    }
    
    var drawView = function(){
        var params = {
            "id": "welcome"
        };
        welcome_node = Tools.elementCreate("div", params);
        
        document.body.appendChild(welcome_node);
        
        var params_cover = {
            "class": "wcover"
        };
        cover = Tools.elementCreate("div", params_cover);
        
        welcome_node.appendChild(cover);
        
        var params_rug = {
            "class": "wrug"
        };
        rug = Tools.elementCreate("div", params_rug);
        
        welcome_node.appendChild(rug);
        
        var params_rug_next = {
            "class": "wnext"
        };
        rug_next = Tools.elementCreate("span", params_rug_next);
        
        rug.appendChild(rug_next);
        rug_next.textContent = "next";
        
        var params_rug_close = {
            "class": "wclose"
        };
        rug_close = Tools.elementCreate("span", params_rug_close);
        
        rug.appendChild(rug_close);
        rug_close.textContent = "close";
        
        Tools.addEvent(rug_close, "click", function(){
           _w.hide(); 
        });
        
        var params_tooltip = {
            "class": "wtooltip"
        };
        tooltip = Tools.elementCreate("div", params_tooltip);
        
        welcome_node.appendChild(tooltip);
        
        var params_tooltip_text = {
            "class": "wtext"
        };
        tooltip_text = Tools.elementCreate("div", params_tooltip_text);
        
        tooltip.appendChild(tooltip_text);
        
        var params_tooltip_number = {
            "class": "wnumber"
        };
        tooltip_number = Tools.elementCreate("span", params_tooltip_number);
        
        tooltip.appendChild(tooltip_number);
        
        Tools.addEvent(rug_next, "click", function(){
           _w.nextStep(); 
        });
        Tools.addEvent(tooltip_number, "click", function(){
           _w.nextStep(); 
        });
    }
    
    this.init();
}

var Tools = { //small class for work help
    
    setCSS:function (elem, prop, value){
        
        if (typeof elem != "object")
            return;
        
        prop = prop.replace(/\-(\w)/, function(str, p1){
            return p1.toUpperCase();            
        });
        
        value = (!isNaN(parseFloat(value))) ? parseFloat(value) + "px" : value;
        
        var propBig = prop[0].toUpperCase() + prop.slice(1,prop.length);
            
        
        if(typeof elem.style[prop] != "undefined")
            elem.style[prop] = value; //other
        else if(typeof elem.style["webkit" + propBig] != "undefined")
            elem.style["webkit" + propBig] = value; //webkit - safari, chrome
        else if(typeof elem.style["Moz" + propBig] != "undefined")
            elem.style["Moz" + propBig] = value; //mozilla - mozilla
        else if(typeof elem.style["O" + propBig] != "undefined")
            elem.style["O" + propBig] = value; //gecko - opera
        else if(typeof elem.style["ms" + propBig] != "undefined")
            elem.style["ms" + propBig] = value; //ie
        else
            return false;
    },
    
    getCSS:function (elem, prop){
        var returnValue;
        if (typeof elem != "object")
            return;
            
        prop = prop.replace(/\-(\w)/, function(str, p1){
            return p1.toUpperCase();            
        });
        
        var propBig = prop[0].toUpperCase() + prop.slice(1,prop.length);        
        
        var style = elem.currentStyle || window.getComputedStyle(elem);
        
        if(style[prop] != "undefined")
            returnValue = style[prop]; //other
        else if(style["webkit" + propBig] != "undefined")
            returnValue = style["webkit" + propBig]; //webkit - safari, chrome
        else if(style["Moz" + propBig] != "undefined")
            returnValue = style["Moz" + propBig]; //mozilla - mozilla
        else if(style["O" + propBig] != "undefined")
            returnValue = style["O" + propBig]; //gecko - opera
        else if(style["ms" + propBig] != "undefined")
            returnValue = style["ms" + propBig]; //ie
        else
            returnValue = false;
        
        return parseFloat(returnValue);
    },
    
    width:function(elem){
        if (typeof elem != "object")
            return;
        
        if (typeof elem.getClientRects == "function")
            return elem.getClientRects()[0].width;
        else
            return this.getCSS(elem, "width");
    },
    
    height:function(elem){
        if (typeof elem != "object")
            return;
            
        if (typeof elem.getClientRects == "function")
            return elem.getClientRects()[0].height;
        else
            return this.getCSS(elem, "height");
    },
    
    top:function(elem){
        if (typeof elem != "object")
            return;
            
        if (typeof elem.getClientRects == "function")
            return elem.getClientRects()[0].top;
        else
            return this.getCSS(elem, "top");
    },
    
    left:function(elem){
        if (typeof elem != "object")
            return;
            
        if (typeof elem.getClientRects == "function")
            return elem.getClientRects()[0].left;
        else
            return this.getCSS(elem, "left");
    },
    
    right:function(elem){
        if (typeof elem != "object")
            return;
            
        if (typeof elem.getClientRects == "function")
            return elem.getClientRects()[0].right;
        else
            return this.getCSS(elem, "right");
    },
    
    bottom:function(elem){
        if (typeof elem != "object")
            return;
            
        if (elem.getBoundingClientRect == "function")
            return elem.getBoundingClientRect().bottom;
        else
            return this.getCSS(elem, "bottom");
    },
    
    addEvent: function(element, type, callback){
        if (element.attachEvent)
            element.attachEvent('on' + type, callback);
        else
            element.addEventListener(type, callback);
    },
    
    ready: function(callback){ //$(document).ready
        if (document.readyState != "complete"){
            setTimeout(function() {
                Tools.ready(callback);
            }, 1);
            return;
        }
        
        callback.call();
    },
    
    addClass: function(elem, classname){
        var prevClasses = (elem.className == "") ? [] : elem.className.split(" ");
        var id = prevClasses.indexOf(classname);        
        if (id == -1){
            prevClasses.push(classname); 
            elem.className = prevClasses.join(" ");
        }
    },
    
    removeClass: function(elem, classname){
        var prevClasses = elem.className.split(" ");
        var id = prevClasses.indexOf(classname);
        if (id != -1){
            delete prevClasses[id];
            elem.className = prevClasses.join(" ");
        }
            
    },
    
    getMousePoint: function(element, event){ //mouse point on the element
        event = event  || window.event;
        
        if (event.clientX && element.getBoundingClientRect)
            return {x: event.clientX - element.getBoundingClientRect().left, y: event.clientY - element.getBoundingClientRect().top}            
        else
            return false;
    },
    
    elementCreate: function(selector, params, text){ //main method SBGTools's object
    
       var element = document.createElement(selector),
            val;
        
        for (var p in params){
            val = params[p];
            element.setAttribute(p, val);
        }
        return element;
    }
}