/*                   Selecting elements
*********************************************************/

QUnit.module('Select elements', function(hooks) {
  hooks.beforeEach(function(assert) {
    hooks.elem1 = document.createElement('div');
    document.body.appendChild(hooks.elem1);
  });

  hooks.afterEach(function(assert) {
    document.body.removeChild(hooks.elem1);
    hooks.elem1 = null;
  });

  QUnit.test('Select all elements by the given tag name', function(assert) {
    var selected = jc.select('div');
    var success = true;

    selected.forEach(function(element) { 
      if (element.tagName !== 'DIV') { success = false; }
    });

    assert.equal(success, true);
  });

  QUnit.test('Select all elements by the given class name', function(assert) {
    var success = true;

    hooks.elem1.className = 'test-class';

    var selected = jc.select('.test-class');

    selected.forEach(function(element) { 
      if (element.className !== 'test-class') { success = false; }
    });

    assert.equal(success, true);
  });

  QUnit.test('Select all elements by the given id', function(assert) {
    hooks.elem1.setAttribute('id', 'test-id');

    var selected = jc.select('#test-id');

    assert.deepEqual(selected[0], hooks.elem1);
  });

  QUnit.test('Select all elements by the given attribute and tag', function(assert) {
    var success = true;

    hooks.elem1.setAttribute('type', 'submit');
    hooks.elem1.style.display = 'none';

    var selected = jc.select('input[type="submit"]');

    selected.forEach(function(element) {
      if (element.tagName !== 'INPUT'  || element.getAttribute('type') !== 'submit') {
        success = false; 
      }
    });

    assert.equal(success, true);
  });
});

/*                    Creating elements
*********************************************************/

QUnit.module('Create element', function(hooks) {
  hooks.beforeEach(function(assert) {
    hooks.tagsObj = { 
      class: 'some-class', 
      style: 'color: blue; display: block;' 
    };
  });

  hooks.afterEach(function(assert) {
    tagsObj = {};
  });

  hooks.addClass = function(elem, className) {
    var newElem = elem.cloneNode(true);

    if (newElem.classList) {
      newElem.classList.add(className);
    } else {
      newElem.className = className;
    }

    return newElem;
  };

  QUnit.test('Create an element from the given tag name', 
    function(assert) {

    var element = jc.create('div');

    assert.deepEqual(element[0], document.createElement('div'));
  });

  QUnit.test('Create an element from the given tag name and set the attrs '
    + 'with specified values from the given object literal', 
    function(assert) {

    var element = jc.create('div', hooks.tagsObj);
    var elseElement = document.createElement('div');

    elseElement = hooks.addClass(elseElement, 'some-class');

    elseElement.style.color = 'blue';
    elseElement.style.display = 'block';

    assert.deepEqual(element[0], elseElement);
  });

  QUnit.test('Create an element from the given tag name, set the attrs with '
    + 'specified values from the given object literal and set innerHTML property '
    + 'to the given value', function(assert) {

    var innerHTML = 'some inner html';
    var element = jc.create('div', hooks.tagsObj, innerHTML);

    var elseElement = document.createElement('div');
    elseElement = hooks.addClass(elseElement, 'some-class');

    elseElement.style.color = 'blue';
    elseElement.style.display = 'block';
    elseElement.innerHTML = innerHTML;

    assert.deepEqual(element[0], elseElement);
  });
});

/*                    Attributes, CSS
*********************************************************/

QUnit.module('Attributes', function(hooks) {
  hooks.beforeEach(function(assert) {
    hooks.elem1 = document.createElement('div');

    document.body.appendChild(hooks.elem1);
  });

  hooks.afterEach(function(assert) {
    document.body.removeChild(hooks.elem1);
    hooks.elem1 = null;
  });

  QUnit.test('Set the given attribute name of selected elements to the '
    + 'given value',  function(assert) {

    jc.select(hooks.elem1).attr('class', 'test-class');

    assert.equal(hooks.elem1.getAttribute('class'), 'test-class');
  });

  QUnit.test('Set the given attribute name of selected elements to the '
    + 'given values  from the object literal', function(assert) {

    jc.select(hooks.elem1).attr({ 
      class: 'some-class', 
      style: 'display: inline;' 
    });

    assert.equal(hooks.elem1.getAttribute('class'), 'some-class');
    assert.equal(hooks.elem1.getAttribute('style'), 'display: inline;');
  });


  QUnit.test('Get the given attribute name of the first selected element', 
    function(assert) {
    hooks.elem1.setAttribute('id', 'test-id');

    assert.equal(jc.select(hooks.elem1).attr('id'), 'test-id');
  });

  QUnit.test('Remove the given attribute from selected objects',
    function(assert) {
      hooks.elem1.setAttribute('id', 'test-id');

      assert.equal(jc.select(hooks.elem1).removeAttr('id').attr('id'),
        null);
    });
});

QUnit.module('CSS', function(hooks) {

  hooks.beforeEach(function(assert) {
    hooks.elem1 = document.createElement('div');
    document.body.appendChild(hooks.elem1);
  });

  hooks.afterEach(function(assert) {
    document.body.removeChild(hooks.elem1);
    hooks.elem1 = null;
  });

  QUnit.test('Set the given css property of selected elements to the given '
    +'value',  function(assert) {

    jc.select(hooks.elem1).css('background', 'blue');

    assert.ok(hooks.elem1.style.background.includes('blue')); //for FF
  });

  QUnit.test('Set the given css properties of selected elements to the '
    + 'given values  from the object literal', function(assert) {

    jc.select(hooks.elem1).css({ background: 'blue', width: '20px' });    
    assert.ok(hooks.elem1.style.background.includes('blue')); //for FF
    assert.equal(hooks.elem1.style.width, '20px');
  });

  QUnit.test('Get the given css property of the first selected element', 
    function (assert) {
    hooks.elem1.style.display = 'inline';

    assert.equal(jc.select(hooks.elem1).css('display'), 'inline');
  });

  QUnit.test('Add the given class name to the selected elements',
    function(assert) {

      var testElem = jc.select(hooks.elem1).addClass('someclass');
      var success = testElem[0].className === 'someclass'
        || testElem[0].classList.contains('someclass');

        assert.equal(success, true);
  });

  QUnit.test('Remove the given class name from the selected elements',
    function(assert) {

      var testElem = jc.select(hooks.elem1).addClass('someclass');
      jc.select(testElem).removeClass('someclass');

      var success = testElem[0].className === 'someclass'
        || testElem[0].classList.contains('someclass');

        assert.equal(success, false);
  });
});

/*                      Manipultion
*********************************************************/

QUnit.module('DOM Manipulation', function(hooks) {

  hooks.beforeEach(function(assert) {
    hooks.elem1 = document.createElement('div');

    hooks.elem2 = document.createElement('div');
    hooks.elem2.innerText = 'this value  should be added';
  });

  hooks.afterEach(function(assert) {
    //document.body.removeChild(hooks.elem1);
    hooks.elem1 = hooks.elem2 = null;
  });

  QUnit.test('append(): Inserts the specified node to the end ' 
    + 'each selected node as a child of the current node', 
    function(assert) {

    jc.select(hooks.elem1).append(hooks.elem2);
    assert.equal(hooks.elem1.lastChild, 
      hooks.elem2);
  });

  QUnit.test('prepend(): Inserts the specified node before each selected '
    + 'node as a child of the current node', function(assert) {

    jc.select(hooks.elem1).prepend(hooks.elem2);
    assert.equal(hooks.elem1.firstChild, 
      hooks.elem2);
  });

  QUnit.test('clone(): Returns the duplicate of the Jc object on '
    + 'which this method was called', function(assert) {

    var cloned = jc.select(hooks.elem1).clone(true);
    assert.deepEqual(cloned[0], hooks.elem1);
  });
});