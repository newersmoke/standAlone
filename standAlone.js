function standAlone(m, c){
     var canvas = {},
         debug = 1;
     configDefault = {
            element : '',
            data : '',
            width : 100,
            height : 100,
            min : null,
            max : null,
            color : "#000",
            colors : ['#7E3817', '#C35817', '#EE9A4D', 
                      '#A0C544', '#348017', '#307D7E'],
            lineWidth : 1,
            globalAlpha : 1,
            padding : {up : 30, down : 30, left : 30, 
                       right : 30, center : 30, elements : 10},
            clock: {radius: 10,
                    background : {
                        color : '#000',
                        opacity :  0.5
                    },
                    dial : {
                        color : 'red',
                        opacity :  1
                    }
            },
            pie: {
                inside_color : 'red',
                outside_color : '#000',
                font : "16px Arial",
                fillStyle : '#000',
                paddingleft : 20,
                paddingtop : 20,
                paddingtoptext : 0,
                paddingcenter : 30,
                paddingelements : 40
            },
            chart : {
                background_color : '#307D7E',
                background_alpha : 1,
                vertical_alpha : 1,
                horizontal_alpha : 1,
                vertical_color : '#EE9A4D',
                vertical_height : 30,
                horizontal_width : 50,
                horizontal_color : '#EE9A4D',
                line_alpha : 0.5,
                line_width : 3,
                line_color : 'blue',
                font : "16px Arial",
                font_vertical : "16px Arial",
                font_horizontal : "16px Arial",
                fillStyle : '#000',
                col: 5,
                row : 5,
                array_key : 'value',
                draw_vertical_lines : 1,
                vertical_lines : 1,
                vertical_lines_color : 'black',
                draw_horizontal_lines : 1,
                horizontal_lines : 0.1,
                horizontal_lines_color : 'black',
            }
        };

    var configs = function(c){
        var conf = configDefault;
        for(var propVals in configDefault){
            if(typeof c != 'undefined' && c.hasOwnProperty(propVals)){
                if(typeof configDefault[propVals] == 'object'){
                    for(var pt in configDefault[propVals]){
                        if(typeof configDefault[propVals][pt] == 'object'){
                            for(var ptt in configDefault[propVals][pt]){
                                if(c[propVals][pt].hasOwnProperty(ptt)){
                                    configDefault[propVals][pt][ptt] = 
                                            c[propVals][pt][ptt];
                                }
                            }
                        } else {
                            if(c[propVals].hasOwnProperty(pt)){
                                configDefault[propVals][pt] = c[propVals][pt];
                            }
                        }
                    }
                } else {
                    conf[propVals] = c[propVals];
                }
            }
        }
        return conf;
    }(c);
    
    configs.get = function(c){
        try{
            if(c.indexOf('/') >= 0){
                return configs[c.split('/')[0]][c.split('/')[1]];
            } else {
                return configs[c];
            }
        }catch(e){
            if(debug){
                console.log(e);
            }
        }
    };
    configs.set = function(c, val){
        try{
            if(c.indexOf('/') >= 0){
                 configs[c.split('/')[0]][c.split('/')[1]] = val;
            } else {
                 configs[c] = val;
            }
        }catch(e){
            if(debug){
                console.log(e);
            }
        }
    };
    
    init = function(m) {
        try{
            this.caller(m);
        } catch (e){
            if(debug){
                console.log(e);
            }
        }
    };
    
    caller = function(m){
        try {
            this[m]();
        } catch (e){
            if(debug){
                console.log(e);
            }
        }
    };
    
    setElementCanvas = function(){
        try{
            var elementHtml = 0;
            if(configs.element.indexOf('.') >= 0 || 
                    configs.element.indexOf('#') >= 0){
                elementHtml = document.querySelector(configs.element);
            } else {
                elementHtml = document.getElementById(configs.element);
            }

            if(elementHtml == undefined){
                elementHtml = 
                        document.getElementsByClassName(configs.element)[0];
                if(elementHtml == undefined){
                    elementHtml = 0;
                }
            }
            canvas = elementHtml.getContext("2d");
            canvas.width = configs.get('width');
            canvas.height = configs.get('height');
            elementHtml.setAttribute('width', configs.get('width'));
            elementHtml.setAttribute('height', configs.get('height'));
        }catch (e){
            if(debug){
                console.log(e);
            }
        }
    };
    
    drawPiePies = function(){
        var delimeter = 2,
            radius = configs.get('width') / 2 ,
            lastPosition = 0, 
            total = 100, 
            data = configs.get('data'),
            colors = configs.get('colors'),
            colors_text = configs.get('pie/fillStyle');
    
        var j = 0;
        for (var i in data) {
            canvas.fillStyle = typeof colors[j] == 'undefined' 
                               ? '#000' 
                               : colors[j];
            canvas.strokeStyle = configs.get('pie/outside_color');
            canvas.beginPath();
            canvas.moveTo(configs.get('width')/ delimeter,
                          configs.get('height')/ delimeter);
            canvas.arc(configs.get('width')/ delimeter,
                       configs.get('height')/ delimeter,
                       radius,
                       lastPosition,
                       lastPosition+(Math.PI*2*(data[i].value/total)),
                       false);
            canvas.lineTo(configs.get('width')/ delimeter,
                          configs.get('height')/ delimeter);
            canvas.fill();
            canvas.stroke();
            j++;
            lastPosition += Math.PI*2*(data[i].value/total);
        }
        canvas.beginPath();
        canvas.fillStyle = configs.get('pie/inside_color');
        canvas.arc(configs.get('width')/ delimeter, 
                   configs.get('height')/ delimeter, 
                   radius - configs.get('pie/paddingcenter'), 
                   0, 
                   2 * Math.PI, 
                   false);
        canvas.fill();
        canvas.stroke();
        
        var j = 0;
        for (var i in data) {
            canvas.beginPath();
            var color= typeof colors_text[j] == 'undefined'
                       ? '#000'
                       : ((typeof colors_text[j] != 'undefined' 
                           && colors_text[j].length == 1) 
                           ?  colors_text : colors_text[j]);
            canvas.fillStyle = color;
            canvas.strokeStyle = color;
            canvas.font = configs.get('pie/font');
            
            var width = canvas.measureText(data[i].name).width;
            canvas.fillText(data[i].name, 
                            radius - width / 2, 
                            radius - configs.get('pie/paddingleft') 
                                    + i * configs.get('pie/paddingtop') 
                                    - configs.get('pie/paddingtoptext'));
            canvas.fill();
            canvas.stroke();
            j++;
        }
    },
    
    createSmallPipeCanvas = function(){
      this.setElementCanvas();
      canvas.beginPath();
      this.drawPiePies();
      canvas.fill();
      canvas.closePath();
      canvas.restore();
      canvas.stroke();
    };
    
    drawPie = function(){
        var delimeter = 2,
            radius = configs.get('width') / 4 ,
            lastPosition = 0, 
            total = 100, 
            data = configs.get('data'),
            colors = configs.get('colors'),
            colors_text = configs.get('pie/fillStyle');
            
        var j = 0;
        for (var i in data) {
            canvas.fillStyle = colors[j];
            canvas.beginPath();
            canvas.moveTo(
                                configs.get('width') / delimeter,
                                configs.get('height') / delimeter
                              );
            canvas.arc(
                                configs.get('width') / delimeter,
                                configs.get('height') / delimeter,
                                radius,
                                lastPosition,
                                lastPosition+(Math.PI*2*(data[i].value/total)),
                                false
                           );
            
            canvas.lineTo(
                                configs.get('width') / delimeter,
                                configs.get('height') / delimeter
                              );
            canvas.fill();
            canvas.stroke();
            canvas.restore();
            j++;
            lastPosition += Math.PI*2*(data[i].value/total);
        }
        lastPosition = 0;
        
        var j = 0;
        for (var i in data) {
            var color= typeof colors_text[j] == 'undefined'
                       ? '#000'
                       : ((typeof colors_text[j] != 'undefined' 
                           && colors_text[j].length == 1) 
                           ?  colors_text : colors_text[j]);
            canvas.fillStyle = color;
            canvas.strokeStyle = color;
            canvas.font = configs.get('pie/font');
            
            canvas.beginPath();
            var angle = (2 * (lastPosition) + 
                            (Math.PI*2*(data[i].value/total)) ) /2;
                var x = radius * Math.cos(angle),
                    y = radius * Math.sin(angle);
                    
                    if(angle < Math.PI){
                        y = configs.get('height') / 2 + y;
                        x = configs.get('width') / 2 + x;
                        
                    } else {
                        y = configs.get('height') / 2 + y;
                        x = configs.get('width') / 2 + x;
                    }
                
                canvas.moveTo(configs.get('width') / delimeter,
                              configs.get('height') / delimeter);
                canvas.lineTo(x , y);
                canvas.fillText(data[i].name, x , y);
                lastPosition += Math.PI*2*(data[i].value/total);
                j++;
        }
    };
    
    
    createPipeCanvas = function(){
      this.setElementCanvas();
      canvas.beginPath();
      this.drawPie();
      canvas.fill();
      canvas.closePath();
      canvas.restore();
      canvas.stroke();
    };
    
    getYCoord = function(y){
        return (configs.get('max') - y) / (configs.get('max') - configs.get('min')) * (configs.get('height') - configs.get('chart/vertical_height') - configs.get('padding/down'));
    }
    
    getMimMax = function (){
        var data = configs.get('data'),
            key = configs.get('chart/array_key');
        for(var c in data){
            if(data[c].hasOwnProperty(key)){
                if(configs.get('min') === null || configs.get('min') > data[c][key]){
                    configs.set('min', data[c][key]);
                }
                
                if(configs.get('max') === null || configs.get('max') < data[c][key]){
                    configs.set('max', data[c][key]);
                }
            }
        }
    }
    
    drawHorizontalGrids = function(){
        canvas.stroke();
        canvas.restore();
        canvas.beginPath();
        canvas.strokeStyle = configs.get('chart/horizontal_lines_color');
        canvas.lineWidth = configs.get('chart/horizontal_lines');
        var prev = [],
            w = (configs.get('width') - configs.get('chart/horizontal_width')) / configs.get('chart/col');
            for(var k = 0 ; k <= configs.get('chart/col'); k++){
                if(first){
                    first = false;
                    canvas.moveTo(w * k, 0);   
                    canvas.lineTo(w * k, configs.get('height') - configs.get('chart/vertical_height'));   
                } else {
                    canvas.moveTo(w * k, 0);   
                    canvas.lineTo(w * k, configs.get('height') - configs.get('chart/vertical_height'));   
                }
            }
        canvas.closePath();
    }
    drawVerticalGrids = function(){
        canvas.stroke();
        canvas.restore();
        canvas.beginPath();
        canvas.strokeStyle = configs.get('chart/vertical_lines_color');
        canvas.lineWidth = configs.get('chart/vertical_lines');
        var del = (configs.get('max') - configs.get('min')) / configs.get('chart/row');
            for(var k = 0 ; k <= configs.get('chart/row'); k++){
                var y_coord = getYCoord(configs.get('min') + del * k)
                if(first){
                    first = false;
                    canvas.moveTo(0, y_coord);   
                    canvas.lineTo(configs.get('width') - configs.get('chart/horizontal_width') , y_coord);   
                } else {
                    canvas.moveTo(0, y_coord);   
                    canvas.lineTo(configs.get('width') - configs.get('chart/horizontal_width'), y_coord);   
                }
            }
        canvas.closePath();
    }
    
    drawLineChart = function(){
        var first = true,
            data = configs.get('data'),
            xScale = (configs.get('width') - configs.get('chart/horizontal_width')) / configs.get('chart/col'),
            i = 0;
        
        canvas.save();
        canvas.fillStyle = configs.get('chart/background_color');
        canvas.globalAlpha = configs.get('chart/background_alpha');
        canvas.fillRect(0,0, configs.get('width'),configs.get('height'));
        canvas.fill();
        canvas.restore();
        
        canvas.fillStyle = configs.get('chart/vertical_color');
        canvas.globalAlpha = configs.get('chart/vertical_alpha');
        canvas.fillRect(0,configs.get('height') - configs.get('chart/vertical_height'), configs.get('width') , configs.get('height'));
        canvas.fill();
        canvas.restore();
        
        canvas.fillStyle = configs.get('chart/horizontal_color');
        canvas.globalAlpha = configs.get('chart/vhorizontal_alpha');
        canvas.fillRect(configs.get('width') - configs.get('chart/horizontal_width'),0, configs.get('width') , configs.get('height'));
        canvas.fill();
        canvas.restore();
        
        
        
        canvas.strokeStyle = configs.get('chart/line_color');
        canvas.lineWidth = configs.get('chart/line_width');
        canvas.globalAlpha = configs.get('chart/line_alpha');
        
        var prev = [];
        for(var c in data){
            if(first){
                first = false;
                canvas.moveTo(xScale * i, getYCoord(configs.get('data')[c][configs.get('chart/array_key')]));   
                canvas.lineTo(xScale * i, getYCoord(configs.get('data')[c][configs.get('chart/array_key')]));   
            } else {
                canvas.moveTo(prev.x, prev.y);   
                canvas.lineTo(xScale * i, getYCoord(configs.get('data')[c][configs.get('chart/array_key')]));   
            }
            prev = {x : xScale * i, y : getYCoord(configs.get('data')[c][configs.get('chart/array_key')])};
            i++;
        }
        if(configs.get('chart/draw_horizontal_lines')){
            drawHorizontalGrids();
        }

        if(configs.get('chart/draw_vertical_lines')){
            drawVerticalGrids();
        }
        
    }
    
    
    createLineChart = function(){
      this.setElementCanvas();
      this.getMimMax();
      canvas.beginPath();
      this.drawLineChart();
      canvas.fill();
      canvas.closePath();
      canvas.restore();
      canvas.stroke();
    };
    
    
    init(m);
}