const math = {
    add(a, b) { return a + b; },
    sub(a, b) { return a - b; },
  };
  
  const strings = {
    upper(s) { return String(s).toUpperCase(); },
    lower(s) { return String(s).toLowerCase(); },
  };
  
  const sayHello = function (name = 'World') {
    return `Hello, ${name}!`;
  };
  
  module.exports = { math, strings, sayHello };
  
  if (require.main === module) {
    const { math, strings, sayHello } = require('./q1-a');
    console.log('math.add(2,3)=', math.add(2, 3));
    console.log('upper("hi")=', strings.upper('hi'));
    console.log(sayHello('Node'));
  }
  
  /*
  Explanation:
  - We create objects math and strings with helper functions.
  - We also create sayHello function.
  - All are exported with module.exports.
  - If this file is run directly, it requires itself and shows usage.
  */
  