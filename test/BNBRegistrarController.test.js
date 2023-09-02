// Importing dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test Suite
describe("BNBRegistrarController", () => {
    let BNS6551Factory, BNBRegistrarController, bnbRegistrarController, BaseRegistrar, factory, baseRegistrar, PublicResolver, publicResolver, BNSRegistry, bnsRegistry;
    let registrationFee, owner, addr1, addr2, baseNode;

    before(async () => {
        // Fetching Signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploying contracts
        BNSRegistry = await ethers.getContractFactory("BNSRegistry");
        bnsRegistry = await BNSRegistry.deploy();

        baseNode = ethers.utils.namehash("bnb");

        BNS6551Factory = await ethers.getContractFactory("BNS6551Factory");
        factory = await BNS6551Factory.deploy();

        BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation");
        baseRegistrar = await BaseRegistrar.deploy(bnsRegistry.address, factory.address, baseNode);

        await bnsRegistry.setSubnodeOwner(ethers.constants.HashZero, ethers.utils.keccak256(ethers.utils.toUtf8Bytes('bnb')), baseRegistrar.address);

        PublicResolver = await ethers.getContractFactory("PublicResolver");
        publicResolver = await PublicResolver.deploy(bnsRegistry.address);

        registrationFee = ethers.utils.parseEther("0.1"); // set registration fee as 0.1 ether
        BNBRegistrarController = await ethers.getContractFactory("BNBRegistrarController");
        bnbRegistrarController = await BNBRegistrarController.deploy(baseRegistrar.address, "bnb", registrationFee);

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
            const fullName = name + ".bnb";
            const nodehash = ethers.utils.namehash(fullName);

            expect(await baseRegistrar.ownerOf(tokenId)).to.equal(addr1.address);
            expect(await publicResolver.addr(nodehash)).to.equal(addr1.address);
            expect(await publicResolver.name(nodehash)).to.equal(fullName);
        });

        it("Should create ERC6551Account", async function () {
            // Expectations
            const name = "example";
            const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
            const id = ethers.BigNumber.from(label);

            const bns6551Addr = await baseRegistrar.bns6551s(id);
            const bns6551 = await ethers.getContractAt("BNS6551Account", bns6551Addr);

            const { chainId, tokenContract, tokenId } = await bns6551.token();

            expect(await bns6551.owner()).to.equal(addr1.address);
            expect((await ethers.provider.getNetwork()).chainId).to.equal(chainId);
            expect(baseRegistrar.address).to.equal(tokenContract);
            expect(id).to.equal(tokenId);
        });
    });

    describe("bid", () => {
        it("Should allow bidding", async () => {
            await bnbRegistrarController.setEndOfYear(Math.floor(Date.now() / 1000) + 60);

            const tokenId = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("example")));

            const initialBalance = await ethers.provider.getBalance(bnbRegistrarController.address);
            const preHighestBid = await bnbRegistrarController.highestBid(tokenId);
            await bnbRegistrarController.connect(addr1).bid(tokenId, { value: ethers.utils.parseEther("0.2") });
            const newBalance = await ethers.provider.getBalance(bnbRegistrarController.address);

            expect(newBalance).to.equal(initialBalance.add(ethers.utils.parseEther("0.2")).sub(preHighestBid));
            expect(await bnbRegistrarController.highestBid(tokenId)).to.equal(ethers.utils.parseEther("0.2"));
            expect(await bnbRegistrarController.highestBidder(tokenId)).to.equal(addr1.address);
        });

        it("Should refund previous bidder and update highest bid and bidder", async () => {
            const tokenId = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("example")));

            const initialBalance = await ethers.provider.getBalance(bnbRegistrarController.address);
            const preHighestBid = await bnbRegistrarController.highestBid(tokenId);
            await bnbRegistrarController.connect(addr2).bid(tokenId, { value: ethers.utils.parseEther("0.3") });
            const newBalance = await ethers.provider.getBalance(bnbRegistrarController.address);

            expect(newBalance).to.equal(initialBalance.add(ethers.utils.parseEther("0.3")).sub(preHighestBid));
            expect(await bnbRegistrarController.highestBid(tokenId)).to.equal(ethers.utils.parseEther("0.3"));
            expect(await bnbRegistrarController.highestBidder(tokenId)).to.equal(addr2.address);
        });
    });

    describe("endAuction", () => {
        it("Should transfer the NFT to the highest bidder at the end of the year", async () => {
            const tokenId = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("example")));

            await bnbRegistrarController.setEndOfYear(Math.floor(Date.now() / 1000) - 1000);

            await bnbRegistrarController.endAuction(tokenId);

            expect(await baseRegistrar.ownerOf(tokenId)).to.equal(addr2.address);
        });

        it("Should update the resolver to the new owner's address", async () => {
            const nodehash = ethers.utils.namehash("example.bnb");

            await publicResolver.connect(addr2).setAddress(nodehash, addr2.address);

            expect(await publicResolver.addr(nodehash)).to.equal(addr2.address);
        });

        it("Should transfer ERC6551Account", async function () {
            // Expectations
            const name = "example";
            const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
            const id = ethers.BigNumber.from(label);

            const bns6551Addr = await baseRegistrar.bns6551s(id);
            const bns6551 = await ethers.getContractAt("BNS6551Account", bns6551Addr);

            const { chainId, tokenContract, tokenId } = await bns6551.token();

            expect(await bns6551.owner()).to.equal(addr2.address);
            expect((await ethers.provider.getNetwork()).chainId).to.equal(chainId);
            expect(baseRegistrar.address).to.equal(tokenContract);
            expect(id).to.equal(tokenId);
        });
    });
});
