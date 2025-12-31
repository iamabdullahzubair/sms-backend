class StudentAdmissionRepo {
    constructor(db) { this.db = db; this.Admission = this.db.models.StudentAdmission; }

    async create(payload, transaction) {
        return this.Admission.create(payload, { transaction });
    }

    async findByAdmissionNumber(admNo) {
        return this.Admission.findOne({ where: { admission_number: admNo } });
    }

    async findByStudentId(studentId) {
        return this.Admission.findOne({ where: { student_id: studentId } });
    }

    async updateByStudentId(studentId, updates, transaction) {
        return this.Admission.update(updates, { where: { student_id: studentId }, transaction });
    }
}

module.exports = StudentAdmissionRepo;
