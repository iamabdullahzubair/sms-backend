class SubjectRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Subject = this.db.models.Subject;
    }

    // ➕ Create Subject
    createSubject(data, transaction = null) {
        return this.Subject.create(data, { transaction });
    }

    // ✏️ Update Subject
    async updateSubject(id, data, transaction = null) {
        const subject = await this.Subject.findByPk(id, { transaction });
        if (!subject) return null;

        await subject.update(data, { transaction });
        return subject;
    }

    // 🔎 Find by ID
    getSubjectById(id, transaction = null) {
        return this.Subject.findByPk(id, { transaction });
    }

    // 🔎 Find by Code
    getSubjectByCode(code, transaction = null) {
        return this.Subject.findOne({ where: { code }, transaction });
    }

    // 📃 All Subjects
    getAllSubjects(transaction = null) {
        return this.Subject.findAll({ transaction });
    }

    // ❌ Delete Subject
    async deleteSubject(id, transaction = null) {
        const subject = await this.Subject.findByPk(id, { transaction });
        if (!subject) return null;

        await subject.destroy({ transaction });
        return true;
    }
}

module.exports = SubjectRepo;
