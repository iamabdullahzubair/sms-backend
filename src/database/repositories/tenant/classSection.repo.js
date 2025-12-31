class ClassSectionRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.ClassSection = this.db.models.ClassSection;
    }

    async addClassSection(data, transaction = null) {
        return await this.ClassSection.create(data, { transaction });
    }

    async updateClassSection(id, data, transaction = null) {
        const classSection = await this.ClassSection.findByPk(id, { transaction });
        if (!classSection) throw new Error("ClassSection not found");

        await classSection.update(data, { transaction });
        return classSection;
    }

    async getClassSectionById(id, transaction = null) {
        return await this.ClassSection.findByPk(id, { transaction });
    }

    async getAllClassSections(transaction = null) {
        return await this.ClassSection.findAll({ transaction });
    }

    async deleteClassSection(id, transaction = null) {
        const classSection = await this.ClassSection.findByPk(id, { transaction });
        if (!classSection) throw new Error("ClassSection not found");

        await classSection.destroy({ transaction });
        return true;
    }
}

module.exports = ClassSectionRepo;
