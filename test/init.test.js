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
    const array = [
      {
        name: "dan gray",
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
    it("should return false if no duplicate first name in array", () => {
      const result = getOrder.duplicateFirstName(array, "kayleigh");
      expect(result).to.be.false;
    });
    it("should return true if 2 or more users have the same first name", () => {
      const result = getOrder.duplicateFirstName(array, "dan");
      expect(result).to.be.false;
    });
  });
  describe("userExists", () => {
    it("should ");
  });
});
