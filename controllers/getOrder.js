module.exports = {
  makeArray: payload => {
    const members = payload.val();
    let all = [];

    for (let name in members) {
      let item = {};
      item.name = name;
      let drinks = members[name];
      for (let beverage in drinks) {
        item[beverage] = drinks[beverage];
      }
      all.push(item);
    }
    return all;
  },
  duplicateFirstName: (array, userName) => {
    const filter = array.filter(
      user => user.name.split(" ")[0].toLowerCase() == userName.toLowerCase()
    );
    return filter.length >= 2 ? true : false;
  },
  userExist: (array, userName) => {
    const filter = array.find(
      user => user.name.split(" ")[0].toLowerCase() == userName.toLowerCase()
    );
    return filter ? true : false;
  },
  getUser: (array, firstName, lastName = null) => {
    if (lastName) {
      return array.find(
        x =>
          x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase() &&
          x.name.split(" ")[1].toLowerCase() == lastName.toLowerCase()
      );
    } else {
      const filteredArray = array.filter(
        x => x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase()
      );
      return filteredArray.length >= 2 ? filteredArray : filteredArray[0];
    }
  }
};
