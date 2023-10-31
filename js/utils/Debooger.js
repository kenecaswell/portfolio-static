var Debooger = function () {
  
  // private properties
  var _element = null;
  
  // methods
  return {
	  // property methods
	  setContainer:function(element) {
		 _element = element; 
	  },
	  
	  getContainer:function() {
		 return _element; 
	  },
	  
	  // methods
	  trace:function(text){
		_element.innerHTML=text;
	  },
	  
	  append:function(text){
		// code for appending
		_element.innerHTML += " " + text;
	  
	  }
  }
  
}();

/*
// @NOTE: Implimentation
Debooger.setContainer(document.getElementById('debug'));
Debooger.trace("HORZ gestured upon");
Debooger.append("Some more text");
*/