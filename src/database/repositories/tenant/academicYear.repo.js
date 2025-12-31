class AcademicYearRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.AcademicYear = this.db.models.AcademicYear;
    }

    addAcademicYear(year, start_date = null, end_date = null, is_active = true, transaction = null) {
        return this.AcademicYear.create(
            { year, start_date, end_date, is_active },
            { transaction }
        );
    }

    async updateAcademicYear(id, data, transaction = null) {
        const academicYear = await this.AcademicYear.findByPk(id, { transaction });
        if (!academicYear) throw new Error("Academic Year not found");

        await academicYear.update(data, { transaction });
        return academicYear;
    }

    getAcademicYearById(id, transaction = null) {
        return this.AcademicYear.findByPk(id, { transaction });
    }

    getAllAcademicYears(transaction = null) {
        return this.AcademicYear.findAll({ transaction });
    }

    async deleteAcademicYear(id, transaction = null) {
        const academicYear = await this.AcademicYear.findByPk(id, { transaction });
        if (!academicYear) throw new Error("Academic Year not found");

        await academicYear.destroy({ transaction });
        return true;
    }
}

module.exports = AcademicYearRepo;
