class TeacherRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Teacher = this.db.models.Teacher;
    }

    createTeacher(data, transaction = null) {
        return this.Teacher.create(data, { transaction });
    }

    async updateTeacher(id, data, transaction = null) {
        const teacher = await this.Teacher.findByPk(id, { transaction });
        if (!teacher) throw new Error("Teacher not found");

        await teacher.update(data, { transaction });
        return teacher;
    }

    getTeacherById(id, transaction = null) {
        return this.Teacher.findByPk(id, { transaction });
    }

    getTeacherByEmail(email, transaction = null) {
        return this.Teacher.findOne({ where: { email }, transaction });
    }

    getAllTeachers(transaction = null) {
        return this.Teacher.findAll({ transaction });
    }

    async deleteTeacher(id, transaction = null) {
        const teacher = await this.Teacher.findByPk(id, { transaction });
        if (!teacher) throw new Error("Teacher not found");

        await teacher.destroy({ transaction });
        return true;
    }
}

module.exports = TeacherRepo;
