
function drawBar(idContainer,duration,isSpecial,fromColor, toColor, percent){
var bar = null;


  try {
    //https://kimmobrunfeldt.github.io/progressbar.js/
      bar = new ProgressBar.Line(idContainer, {
          strokeWidth: 4,
          easing: 'easeOut',
          duration: duration,
          color: '#FFEA82',
          trailColor: isSpecial? '#ffe500' : '#eee',
          trailWidth: isSpecial? 4 : 3,
          svgStyle: {width: '100%', height: '100%'},
          from: {color: fromColor},
          to: {color: toColor},
          step: (state, bar) => {
              bar.path.setAttribute('stroke', state.color);
            }
      });
        
 
      bar.animate(percent);

        
        // setTimeout(() => {   
        // 	bar.animate(0.1);
        // }, 1000);
                  
        // setTimeout(() => {   
        // 	bar.animate(0.6);
        // }, 2000);

  } catch(e) {
      console.log(e);
  }

  return bar;
}


  function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  }

  function pickHex(endColor, startColor, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(endColor[0] * w1 + startColor[0] * w2),
        Math.round(endColor[1] * w1 + startColor[1] * w2),
        Math.round(endColor[2] * w1 + startColor[2] * w2)];
    return rgb;
}


var barList = {
  "Life": {
    "startColor":  [255,0,0],
    "fullColor":   [20,230,20],
    "percent": 0.50
  },
  "Mana": {
    "startColor":  [80,0,80],
    "fullColor":   [0,242,255],
    "percent": 0.75
  },
  "Chi": {
    "startColor":  [80,0,80],
    "fullColor":   [0,50,255],
    "percent": 0.25
  }
};
