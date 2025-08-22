module.exports = {
    math: {
      add(a, b) { return a + b; },
      sub(a, b) { return a - b; },
    },
    strings: {
      upper(s) { return String(s).toUpperCase(); },
      lower(s) { return String(s).toLowerCase(); },
    },
    sayHello(name = 'World') {
      return `Hello, ${name}!`;
    },
  };
  
  if (require.main === module) {
    const utils = require('./q1-b');
    console.log('add(5,7)=', utils.math.add(5, 7));
    console.log(utils.sayHello('Developer'));
  }
  
  /*
  Explanation:
  - Entire object with nested math, strings and sayHello is exported.
  - If run directly, the code shows example calls.
  */
  