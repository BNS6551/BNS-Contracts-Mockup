const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BNSRegistrarController", function () {
    let BNSRegistryMockup, NameWrapperMockup, BNSRegistrarControllerMockup;
    let registry, nameWrapper, registrar;
    let owner, addr1, addr2;
    let node;

    beforeEach(async function () {
        BNSRegistryMockup = await ethers.getContractFactory("BNSRegistryMockup");
        registry = await BNSRegistryMockup.deploy();
        await registry.deployed();

        NameWrapperMockup = await ethers.getContractFactory("NameWrapperMockup");
        nameWrapper = await NameWrapperMockup.deploy();
        await nameWrapper.deployed();

        BNSRegistrarControllerMockup = await ethers.getContractFactory("BNSRegistrarControllerMockup");
        registrar = await BNSRegistrarControllerMockup.deploy(registry.address, nameWrapper.address, ethers.utils.parseEther("0.1"), 100);
        await registrar.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
        node = ethers.utils.namehash("example.bns");
    });

    describe("register", function () {
        it("Should register a new BNS name", async function () {
            await registrar.register(node, owner.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.1") });

            // expect(await registry.owner(node)).to.equal(owner.address);
        });

        it("Should fail if the registration fee is incorrect", async function () {
            await expect(registrar.register(node, owner.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.01") }))
                .to.be.revertedWith("Incorrect registration fee");
        });

        it.skip("Should fail if the name is already registered", async function () {
            await registrar.register(node, owner.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.1") });

            await expect(registrar.register(node, addr1.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.1") }))
                .to.be.revertedWith("Name already registered");
        });
    });

    describe.skip("transfer", function () {
        beforeEach(async function () {
            await registrar.register(node, owner.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.1") });
        });

        it("Should transfer the BNS name to a new owner", async function () {
            await registrar.transfer(node, addr1.address);

            expect(await registry.owner(node)).to.equal(addr1.address);
        });

        it("Should fail if the name is not registered", async function () {
            const unregisteredNode = ethers.utils.namehash("unregistered.bns");

            await expect(registrar.transfer(unregisteredNode, addr1.address))
                .to.be.revertedWith("Name not registered");
        });
    });

    describe.skip("bid", function () {
        it("Should place a bid on a BNS name", async function () {
            await registrar.bid(node, { value: ethers.utils.parseEther("0.1") });

            const bid = (await registrar.bids(node))[0];

            expect(bid.bidder).to.equal(owner.address);
            expect(bid.amount).to.equal(ethers.utils.parseEther("0.1"));
        });

        it("Should fail if the auction has ended", async function () {
            // Increase the block number to end the auction
            for (let i = 0; i < 100; i++) {
                await ethers.provider.send("evm_mine");
            }

            await expect(registrar.bid(node, { value: ethers.utils.parseEther("0.1") }))
                .to.be.revertedWith("Auction has ended");
        });
    });

    describe.skip("endAuction", function () {
        beforeEach(async function () {
            await registrar.register(node, owner.address, ethers.constants.AddressZero, { value: ethers.utils.parseEther("0.1") });

            await registrar.connect(addr1).bid(node, { value: ethers.utils.parseEther("0.1") });
            await registrar.connect(addr2).bid(node, { value: ethers.utils.parseEther("0.2") });

            // Increase the block number to end the auction
            for (let i = 0; i < 100; i++) {
                await ethers.provider.send("evm_mine");
            }
        });

        it("Should transfer the BNS name to the highest bidder and refund all other bidders", async function () {
            await registrar.endAuction(node);

            expect(await registry.owner(node)).to.equal(addr2.address);

            expect(await ethers.provider.getBalance(addr1.address)).to.equal(ethers.utils.parseEther("10000"));
            expect(await ethers.provider.getBalance(addr2.address)).to.equal(ethers.utils.parseEther("9999.8"));
        });

        it("Should fail if the auction has not ended yet", async function () {
            // Decrease the block number to before the auction end block
            await ethers.provider.send("evm_mine", [0]);

            await expect(registrar.endAuction(node))
                .to.be.revertedWith("Auction has not ended yet");
        });

        it("Should fail if there are no bids for the name", async function () {
            const unbidNode = ethers.utils.namehash("unbid.bns");

            await expect(registrar.endAuction(unbidNode))
                .to.be.revertedWith("No bids for this name");
        });
    });
});
