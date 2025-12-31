class StudentEnrollmentRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.StudentEnrollment = this.db.models.StudentEnrollment;
    }

    async enrollStudent(data, transaction = null) {
        return await this.StudentEnrollment.create(data, { transaction });
    }

    async updateEnrollment(id, data, transaction = null) {
        const enrollment = await this.StudentEnrollment.findByPk(id, { transaction });
        if (!enrollment) throw new Error("Enrollment record not found");

        await enrollment.update(data, { transaction });
        return enrollment;
    }

    async getEnrollmentById(id, transaction = null) {
        return await this.StudentEnrollment.findByPk(id, { transaction });
    }

    async getMaxRollNumber(classSectionId, academicYearId, transaction = null) {
        const row = await this.Enrollment.findOne({
            where: { class_section_id: classSectionId, academic_year_id: academicYearId },
            order: [['roll_number', 'DESC']],
            transaction
        });
        return row ? row.roll_number : 0;
    }

    async findByStudentAndYear(studentId, academicYearId) {
        return this.Enrollment.findOne({ where: { student_id: studentId, academic_year_id: academicYearId } });
    }

    async getAllEnrollments(transaction = null) {
        return await this.StudentEnrollment.findAll({ transaction });
    }

    async deleteEnrollment(id, transaction = null) {
        const enrollment = await this.StudentEnrollment.findByPk(id, { transaction });
        if (!enrollment) throw new Error("Enrollment record not found");

        await enrollment.destroy({ transaction });
        return true;
    }
}

module.exports = StudentEnrollmentRepo;
