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
  }
};
