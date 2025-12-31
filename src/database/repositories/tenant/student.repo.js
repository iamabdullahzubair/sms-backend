class StudentRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Student = this.db.models.Student;
    }

    addStudent(data, transaction = null) {
        return this.Student.create(data, { transaction });
    }

    updateStudent(id, data, transaction = null) {
        return this.Student.update(data, { where: { id }, transaction });
    }

    getStudentById(id, transaction = null) {
        return this.Student.findByPk(id, { transaction });
    }

    getAllStudents(transaction = null) {
        return this.Student.findAll({ transaction });
    }

    deleteStudent(id, transaction = null) {
        return this.Student.destroy({ where: { id }, transaction });
    }
}

module.exports = StudentRepo;
