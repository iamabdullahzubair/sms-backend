class GlobalSettingRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.GlobalSetting = this.db.models.GlobalSetting;
    }

    async createSetting(data, transaction = null) {
        return await this.GlobalSetting.create(data, { transaction });
    }

    async updateSetting(id, data, transaction = null) {
        const setting = await this.GlobalSetting.findByPk(id, { transaction });
        if (!setting) throw new Error("Setting not found");

        await setting.update(data, { transaction });
        return setting;
    }

    async getSettingById(id, transaction = null) {
        return await this.GlobalSetting.findByPk(id, { transaction });
    }

    async getSettingByCode(code, transaction = null) {
        return await this.GlobalSetting.findOne({ where: { code }, transaction });
    }

    async getAllSettings(transaction = null) {
        return await this.GlobalSetting.findAll({ transaction });
    }

    async deleteSetting(id, transaction = null) {
        const setting = await this.GlobalSetting.findByPk(id, { transaction });
        if (!setting) throw new Error("Setting not found");

        await setting.destroy({ transaction });
        return true;
    }
}

module.exports = GlobalSettingRepo;
