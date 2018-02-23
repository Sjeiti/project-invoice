const faker = require('faker');


console.log(
    '\n',faker.name.findName()
    ,'\n',faker.internet.email()
    ,'\n',faker.helpers.createCard()
); // todo: remove log