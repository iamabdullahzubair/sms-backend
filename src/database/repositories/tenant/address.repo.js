class AddressRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Address = this.db.models.Address;
    }

    async addAddress(data, transaction = null) {
        return await this.Address.create(data, { transaction });
    }

    async updateAddress(id, data, transaction = null) {
        const address = await this.Address.findByPk(id, { transaction });
        if (!address) throw new Error("Address not found");

        await address.update(data, { transaction });
        return address;
    }

    async getAddressById(id, transaction = null) {
        return await this.Address.findByPk(id, { transaction });
    }

    async getAllAddresses(transaction = null) {
        return await this.Address.findAll({ transaction });
    }

    async deleteAddress(id, transaction = null) {
        const address = await this.Address.findByPk(id, { transaction });
        if (!address) throw new Error("Address not found");

        await address.destroy({ transaction });
        return true;
    }
}

module.exports = AddressRepo;
