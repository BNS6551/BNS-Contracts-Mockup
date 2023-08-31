// Importing dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test Suite
describe("BNBRegistrarController", () => {
    let BNBRegistrarController, bnbRegistrarController, BaseRegistrar, baseRegistrar, PublicResolver, publicResolver, BNSRegistry, bnsRegistry;
    let registrationFee, owner, addr1, addr2, baseNode;

    before(async () => {
        // Fetching Signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploying contracts
        BNSRegistry = await ethers.getContractFactory("BNSRegistry");
        bnsRegistry = await BNSRegistry.deploy();

        baseNode = ethers.utils.namehash("bnb");

        BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation");
        baseRegistrar = await BaseRegistrar.deploy(bnsRegistry.address, baseNode);

        await bnsRegistry.setSubnodeOwner(ethers.constants.HashZero, ethers.utils.keccak256(ethers.utils.toUtf8Bytes('bnb')), baseRegistrar.address);

        PublicResolver = await ethers.getContractFactory("PublicResolver");
        publicResolver = await PublicResolver.deploy(bnsRegistry.address);

        registrationFee = ethers.utils.parseEther("0.1"); // set registration fee as 0.1 ether
        BNBRegistrarController = await ethers.getContractFactory("BNBRegistrarController");
        bnbRegistrarController = await BNBRegistrarController.deploy(baseRegistrar.address, registrationFee);

        await baseRegistrar.setController(bnbRegistrarController.address);
    });

    describe("register", () => {
        it("Should register a domain name", async () => {
            // Variables
            const name = "example";
            const resolver = publicResolver.address;

            // Function call
            await bnbRegistrarController.connect(addr1).register(name, addr1.address, resolver, addr1.address, { value: registrationFee });

            // Expectations
            const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
            const tokenId = ethers.BigNumber.from(label);
            const nodehash = ethers.utils.namehash(name + ".bnb");

            expect(await baseRegistrar.ownerOf(tokenId)).to.equal(addr1.address);
            expect(await publicResolver.addr(nodehash)).to.equal(addr1.address);
        });
    });
});
