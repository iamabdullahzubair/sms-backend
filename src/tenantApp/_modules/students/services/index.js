
const { validateWithSchema } = require('../../../../@/@utils/schema_validator');
const StudentRepo = require('../../../../database/repositories/tenant/student.repo');
const StudentAdmissionRepo = require('../../../../database/repositories/tenant/student_admission.repo');
const StudentEnrollmentRepo = require('../../../../database/repositories/tenant/student_enrollment.repo');
const { AuditLogService } = require('../../../global_services/auditLog');
const { createStudentSchema } = require('../validators/student.schema');

class StudentService {
    constructor(req) {
        this.db = req.tenant;
        this.sequelize = this.db.sequelize;

        this.req = req; // user, branch, ip, etc.

        this.studentRepo = new StudentRepo(this.db);
        this.admissionRepo = new StudentAdmissionRepo(this.db);
        this.enrollmentRepo = new StudentEnrollmentRepo(this.db);

        this.auditLog = new AuditLogService(this.db, req);
    }

    async getStudent(id) {
        return this.studentRepo.getStudentById(id);
    };

    async getAllStudents() {
        return this.studentRepo.getAllStudents();
    };

    async createStudent() {
        const transaction = await this.sequelize.transaction();
        const payload = this.req?.body || {}

        try {
            const validatedData = await validateWithSchema(createStudentSchema, payload);

            const student = await this.studentRepo.addStudent(validatedData, transaction);

            await this.auditLog.logCreate({
                module: "STUDENT",
                recordId: student.id,
                newValue: payload,
                transaction,
            });

            await transaction.commit();
            return student;
        } catch (err) {
            await transaction.rollback();
            throw new ApiError(500, "Failed to create student", err.message);
        }


    }

    async createAdmission() {
        const transaction = await this.sequelize.transaction();
        const studentId = this.req?.query
        const payload = this.req?.body || {}

        try {
            // Prevent duplicate admission
            const existing = await this.admissionRepo.findByStudentId(studentId);
            if (existing) throw new ApiError(400, "Admission already exists");

            const admission = await this.admissionRepo.create(
                { ...payload, student_id: studentId },
                transaction
            );

            await this.auditLog.logCreate({
                module: "ADMISSION",
                recordId: admission.id,
                newValue: payload,
                transaction,
            });

            await transaction.commit();
            return admission;
        } catch (err) {
            await transaction.rollback();
            throw new ApiError(500, "Failed to create admission", err.message);
        }
    };

    async enrollStudent(payload) {
        const transaction = await this.sequelize.transaction();

        try {
            // Check duplicate enrollment for same year
            const exists = await this.enrollmentRepo.findByStudentAndYear(
                payload.student_id,
                payload.academic_year_id
            );
            if (exists) throw new ApiError(400, "Student already enrolled");

            // Generate roll number
            const lastRoll = await this.enrollmentRepo.getMaxRollNumber(
                payload.class_section_id,
                payload.academic_year_id
            );

            payload.roll_number = lastRoll + 1;

            const enrollment = await this.enrollmentRepo.enrollStudent(payload, transaction);

            await this.auditLog.logCreate({
                module: "ENROLLMENT",
                recordId: enrollment.id,
                newValue: payload,
                transaction,
            });

            await transaction.commit();
            return enrollment;
        } catch (err) {
            await transaction.rollback();
            throw new ApiError(500, "Failed to enroll student", err.message);
        }

    }
}

module.exports = StudentService;
