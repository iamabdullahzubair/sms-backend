class ClassRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Class = this.db.models.Class;
    }

    async addClass(class_name, transaction = null) {
        return await this.Class.create({ class_name }, { transaction });
    }

    async updateClass(id, data, transaction = null) {
        const classInstance = await this.Class.findByPk(id, { transaction });
        if (!classInstance) throw new Error('Class not found');

        await classInstance.update(data, { transaction });
        return classInstance;
    }

    async getClassById(id, transaction = null) {
        return await this.Class.findByPk(id, { transaction });
    }

    async getAllClasses(transaction = null) {
        return await this.Class.findAll({ transaction });
    }

    async deleteClass(id, transaction = null) {
        const classInstance = await this.Class.findByPk(id, { transaction });
        if (!classInstance) throw new Error('Class not found');

        await classInstance.destroy({ transaction });
        return true;
    }
}

module.exports = ClassRepo;
