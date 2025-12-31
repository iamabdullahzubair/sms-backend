const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Branch extends Model {}

  Branch.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      branch_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        // comment: 'Short unique identifier for the branch (e.g., "DEL-MAIN")'
      },
      branch_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      branch_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      affiliation_Number: {
        type: DataTypes.STRING(100),
      },
      tag_line: {
        type: DataTypes.STRING(100),
        // comment: 'Optional different name for display purposes'
      },
      board_type: {
        type: DataTypes.STRING(100)
      },
      establishment_date: {
        type: DataTypes.DATEONLY,
      },
      contact_number: {
        type: DataTypes.STRING(15),
      },
      alternate_contact_number: {
        type: DataTypes.STRING(15),
      },
      logo_url: {
        type: DataTypes.STRING(255),
      },
      latitude: {
        type: DataTypes.DECIMAL(9,6),
        // comment: 'Map positioning ke liye'
      },
      longitude: {
        type: DataTypes.DECIMAL(9,6),
        // comment: 'Map positioning ke liye'
      },
      landmark: {
        type: DataTypes.STRING(100),
        // comment: 'Nearby popular jagah (e.g. "Fortis Hospital ke saamne")'
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(50),
        defaultValue: 'India',
      },
      pin_code: {
        type: DataTypes.STRING(10),
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_head_branch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        // comment: 'Main branch hai ki nahi'
      },
      timezone: {
        type: DataTypes.STRING(50),
        defaultValue: 'Asia/Kolkata',
      },
    
    },
    {
      sequelize,
      modelName: 'Branch',
      tableName: 'branches',
      timestamps: true,
      paranoid: true, // Enables soft deletion
    }
  );


  return Branch;
};