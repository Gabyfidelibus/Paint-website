define([],function(){
  return{
    handleInputChange:function (e) {
      let target = e.target;
      if (e.target.type !== 'range') {
        target = document.getElementById('range');
      } 
      const min = target.min;
      const max = target.max;
      const val = target.value;
      
      target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    }
  }
});