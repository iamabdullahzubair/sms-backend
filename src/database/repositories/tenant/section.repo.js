class SectionRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Section = this.db.models.Section;
    }

    addSection(data, transaction = null) {
        return this.Section.create(data, { transaction });
    }

    async updateSection(id, data, transaction = null) {
        const section = await this.Section.findByPk(id, { transaction });
        if (!section) throw new Error("Section not found");

        await section.update(data, { transaction });
        return section;
    }

    getSectionById(id, transaction = null) {
        return this.Section.findByPk(id, { transaction });
    }

    getAllSections(transaction = null) {
        return this.Section.findAll({ transaction });
    }

    async deleteSection(id, transaction = null) {
        const section = await this.Section.findByPk(id, { transaction });
        if (!section) throw new Error("Section not found");

        await section.destroy({ transaction });
        return true;
    }
}

module.exports = SectionRepo;
