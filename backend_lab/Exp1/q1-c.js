function createUtils(prefix = '') {
    return {
      math: { add: (a, b) => a + b },
      sayHello: (name = 'World') => `${prefix}Hello, ${name}!`,
    };
  }
  module.exports = createUtils;
  
  if (require.main === module) {
    const createUtils = require('./q1-c');
    const u = createUtils('[App] ');
    console.log('add(1,9)=', u.math.add(1, 9));
    console.log(u.sayHello('Team'));
  }
  
  /*
  Explanation:
  - createUtils is a factory function returning an object with math and sayHello.
  - It allows customization with prefix.
  - Demonstration shows adding numbers and greeting with prefix.
  */
  