const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BNSRegistryMockup", function () {
  let bnsRegistryMockup;
  let owner, addr1, addr2, addr3, addrs;

  beforeEach(async () => {
    const BNSRegistryMockup = await ethers.getContractFactory("BNSRegistryMockup");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    bnsRegistryMockup = await BNSRegistryMockup.deploy();
    await bnsRegistryMockup.deployed();
  });

  describe("Deployment", () => {
    it("should set the deployer as the owner of the zero node", async () => {
      expect(await bnsRegistryMockup.owner(ethers.constants.HashZero)).to.equal(owner.address);
    });
  });

  describe("setOwner", () => {
    it("Should set new owner", async function () {
      await bnsRegistryMockup.setOwner(ethers.constants.HashZero, addr1.address);
      expect(await bnsRegistryMockup.owner(ethers.constants.HashZero)).to.equal(
        addr1.address
      );
    });

    it("Should revert if not called by owner or operator", async function () {
      await expect(
        bnsRegistryMockup.connect(addr1).setOwner(ethers.constants.HashZero, addr2.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("setResolver", () => {
    it("Should set new resolver", async function () {
      await bnsRegistryMockup.setResolver(ethers.constants.HashZero, addr1.address);
      expect(await bnsRegistryMockup.resolver(ethers.constants.HashZero)).to.equal(
        addr1.address
      );
    });

    it("Should revert if not called by owner or operator", async function () {
      await expect(
        bnsRegistryMockup.connect(addr1).setResolver(ethers.constants.HashZero, addr2.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("setTTL", () => {
    it("Should set new TTL", async function () {
      await bnsRegistryMockup.setTTL(ethers.constants.HashZero, 3600);
      expect(await bnsRegistryMockup.ttl(ethers.constants.HashZero)).to.equal(3600);
    });

    it("Should revert if not called by owner or operator", async function () {
      await expect(
        bnsRegistryMockup.connect(addr1).setTTL(ethers.constants.HashZero, 3600)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("setApprovalForAll", () => {
    it("Should approve operator", async function () {
      await bnsRegistryMockup.setApprovalForAll(addr1.address, true);
      expect(await bnsRegistryMockup.isApprovedForAll(owner.address, addr1.address)).to.equal(
        true
      );
    });

    it("Should revoke operator approval", async function () {
      await bnsRegistryMockup.setApprovalForAll(addr1.address, true);
      await bnsRegistryMockup.setApprovalForAll(addr1.address, false);
      expect(await bnsRegistryMockup.isApprovedForAll(owner.address, addr1.address)).to.equal(
        false
      );
    });
  });
});
