import { expect } from "chai";
import getOrder from "../controllers/getOrder.js";

const payload = {
  val: function() {
    return {
      dan: {
        coffee: "blue",
        tea: "black"
      },
      kayleigh: {
        tea: "Black like her soul"
      },
      tim: {
        coffee: "brown",
        tea: "red"
      }
    };
  }
};

const array = [
  {
    name: "dan gray",
    coffee: "blue",
    tea: "black"
  },
  {
    name: "tim smith",
    coffee: "blue",
    tea: "black"
  },
  {
    name: "tim",
    coffee: "blue",
    tea: "black"
  },
  {
    name: "kayleigh chapman",
    tea: "Black like her soul"
  },
  {
    name: "dan webb",
    coffee: "brown",
    tea: "red"
  }
];

describe("GetOrder", () => {
  describe("makeArray", () => {
    it("should return an array of users drink", () => {
      const result = getOrder.makeArray(payload);
      expect(result).to.deep.equal([
        {
          name: "dan",
          coffee: "blue",
          tea: "black"
        },
        {
          name: "kayleigh",
          tea: "Black like her soul"
        },
        {
          name: "tim",
          coffee: "brown",
          tea: "red"
        }
      ]);
    });
  });
  describe("duplicateFirstName", () => {
    it("should return false if no duplicate first name in array", () => {
      const result = getOrder.duplicateFirstName(array, "kayleigh");
      expect(result).to.be.false;
    });
    it("should return true if 2 or more users have the same first name", () => {
      const result = getOrder.duplicateFirstName(array, "dan");
      expect(result).to.be.true;
    });
    it("should handle single names", () => {
      const result = getOrder.duplicateFirstName(array, "tim");
      expect(result).to.be.true;
    });
  });
  describe("userExists", () => {
    it("should return true if user exists", () => {
      const result = getOrder.userExist(array, "Tim");
      expect(result).to.be.true;
    });
    it("should return flase if user doesn't exists", () => {
      const result = getOrder.userExist(array, "Blake");
      expect(result).to.be.false;
    });
  });
  describe("getUser", () => {
    it("should return a user from an array", () => {
      const result = getOrder.getUser(array, "Kayleigh");
      expect(result).to.deep.equal({
        name: "kayleigh chapman",
        tea: "Black like her soul"
      });
    });
    it("should get user with first & last name", () => {
      const result = getOrder.getUser(array, "Dan", "Webb");
      expect(result).to.deep.equal({
        name: "dan webb",
        coffee: "brown",
        tea: "red"
      });
    });
    it("return array if more than one user", () => {
      const result = getOrder.getUser(array, "Dan");
      expect(result).to.deep.equal([
        {
          name: "dan gray",
          coffee: "blue",
          tea: "black"
        },
        {
          name: "dan webb",
          coffee: "brown",
          tea: "red"
        }
      ]);
    });
  });
});
