(function(window) {
'use strict'

function Jc(elements) {
	for (let i = 0; i < elements.length; i++) {
		this[i] = elements[i]
	}

	this.length = elements.length;
}

/*                                         Utils
*************************************************/
Jc.prototype.map = function(callback) {
	let results = [];

	for (let i = 0; i < this.length; i++) {
		results.push(callback.call(this, this[i], i));
	}

	return results;
}

Jc.prototype.forEach = function(callback) {
	this.map(callback);

	return this;
};

Jc.prototype.mapOne = function(callback) {
	let result = this.map(callback);
	
	return result.length > 1 ? result : result[0];
};

Jc.prototype.isPlainObject = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

/*               Manipulation
**********************************************/
Jc.prototype.text = function(text) {
	if (typeof text !== 'undefined') {
		return this.forEach(function(element) {
			element.innerText = text;
		});
	} else {
		return this.mapOne(function(element) {
			return element.innerText;
		});
	}
};

Jc.prototype.html = function(html) {
	if (typeof html !== 'undefined') {
		this.forEach(function (element) {
			element.innerHTML = html;
		});
 
		return this;
	} else {
		return this.mapOne(function(element) {
			return element.innerHTML;
		});
	}
};

Jc.prototype.attr = function(attrName, value) {
	if (this.isPlainObject(attrName)) {
		return this.forEach(function(element) {
			for (let attr in attrName) {
				element.setAttribute(attr, attrName[attr]);
			}
		});
	} else if (typeof value !== 'undefined') {
		return this.forEach(function(element) {
			element.setAttribute(attrName, value);
		});
	} else if (typeof attrName ==='string' && typeof value === 'undefined')  {
		return this.mapOne(function(element) {
			return element.getAttribute(attrName);
		});
	}
}

Jc.prototype.removeAttr = function(attribute) {
	return this.forEach(function(element) {
		element.removeAttribute(attribute);
	});
};

Jc.prototype.css = function(name, value) {
	if (this.isPlainObject(name)) {
		return this.forEach(function(element) {
			for (let item in name) {
				element.style[item] = name[item];
			}
		});
	} else if (typeof value !== 'undefined') {
		return this.forEach(function(element) {
			element.style[name] = value;
		});
	} else if (typeof name ==='string' && typeof value === 'undefined')  {
		return this.mapOne(function(element) {
			return element.style[name];
		});
	}
}

Jc.prototype.addClass = function(className) {
	if (this[0].classList) {
		return this.forEach(function(element) {
			 element.classList.add(className);   
		});
	} else {
		return this.forEach(function(element) {
			element.className += ' ' + className;
		});
	}
};

Jc.prototype.removeClass = function(className) {
	return this.forEach(function(element) {
		if (element.classList) {
			element.classList.remove(className);
		} else {
			let classNames = element.className.split(' ');
			element.className = classNames.filter(function(item) {
				return item != className;
			});
		}
	});
};

/**
 * @param {Jc | Node}
 */
Jc.prototype.append = function(child) {
	return this.forEach(function(element) {
		if (child.length > 0) {
			element.appendChild(child[0]);
		} else {
			element.appendChild(child);
		}
	});
};

/**
 * @param {Jc | Node}
 */
Jc.prototype.prepend = function(child) {
	return this.forEach(function(element) {
		if (child.length > 0) {
			element.insertBefore(child[0], element.firstChild);
		} else {
			element.insertBefore(child, element.firstChild);
		}
	});
};

/**
 * @param {Jc | Node}
 */
Jc.prototype.clone = function(deep) {
	let clonedNode = this.mapOne(function(element) {
		return element.cloneNode(deep)
	});
	
	return new Jc([clonedNode]);
}

Jc.prototype.remove = function(){
	return this.forEach(function(element) {
		return this.mapOne(function(element) {
			return element.parentNode.removeChild(element);
		});
	});
};

/*                               events
****************************************/
Jc.prototype.on = function(event, handler) {
	if (document.addEventListener) {
		return this.forEach(function(element) {
			element.addEventListener(event, handler.bind(element));
		});
	} else if (document.attacheEvent) {
		return this.forEach(function(element) {
			element.attachEvent('on' + event, handler.bind(element));
		});
	} else {
		return this.forEach(function(element) {
			element['on' + event] = handler.bind(element);
		});
	}
};

//должна быть передана та же функция
Jc.prototype.off = function(event, handler) {
	if (document.removeEventListener) {
		return this.forEach(function(element) {
			element.removeEventListener(event, handler);
		}); 
	} else if (document.detachEvent) {
		return this.forEach(function(element) {
			element.detachEvent('on' + event, handler);
		});
	} else {
		return this.forEach(function(element) {
			element['on' + event] = null;
		});
	}
};

Jc.prototype.ready = function(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', fn);
	} else {
		document.attacheEvent('onreadystatechange', function() {
			if (document.readyState != 'loading') {
				fn();
			}
		});
	}
}

let jc = {
	select: function(selector) {
		let elements;
	
		if (typeof selector === 'string') {
			elements = document.querySelectorAll(selector);
		} else if (selector.length) {
			elements = [document.querySelector(selector)];
		} else {
			elements = [selector]
		}
	
		return new Jc(elements);
	},
	create: function(tag, opts, innerHTML) {
		let element = new Jc( [document.createElement(tag)] );

		if (opts && Jc.prototype.isPlainObject(opts)) {
			Jc.prototype.attr.call(element, opts);
		}
		if (innerHTML) {
			element.html(innerHTML);
		}

		return element;
	}
};

window.jc = jc;
})(window);