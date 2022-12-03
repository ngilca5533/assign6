const fs = require('fs');

const Sequelize = require('sequelize');
var sequelize = new Sequelize('lnxtcnzf', 'lnxtcnzf', 'ogoYAm4MfRh3lLoWQQYN5wijeZffUlWH', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });


module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve("Sync was successful")
        }).catch(function (error) {
            reject("unable to sync the database");
        });
    })
}


module.exports.getAllStudents = function () {

    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {

            Student.findAll({
            }).then(function (data) {
                resolve(data)
            }).catch(function (error) {
                reject("no results returned");
            });


        });

    })
}

module.exports.getTAs = function () {

    return new Promise((resolve, reject) => {
        reject();

    })

}


module.exports.getCourses = function () {

    return new Promise((resolve, reject) => {
        Course.findAll({
        }).then(function (data) {
            resolve(data)
        }).catch(function (error) {
            reject("no results returned");
        });

    })

}

module.exports.getStudentsByCourse = function (courseNum) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {

            Student.findAll({
                where: {
                    course: courseNum
                }
            }).then(function (data) {
                resolve(data)
            }).catch(function (error) {
                reject("no results returned");
            });


        });

    })
}

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {

            Student.findAll({
                where: {
                    studentNum: num
                }
            }).then(function (data) {
                resolve(data[0])
            }).catch(function (error) {
                reject("No students found");
            });


        });

    })
}

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        for (const property in studentData) {
            if (studentData[property] == "") {
                studentData[property] = null
            }
        }
        console.log(studentData)

        sequelize.sync().then(function () {

            Student.create({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            }).then(function () {
                resolve("operation successfull")
            }).catch(function (error) {
                reject("unable to create student");
            });


        });

    })

}

module.exports.addCourse = function (courseData) {
    return new Promise((resolve, reject) => {
        for (const property in courseData) {
            if (courseData[property] == "") {
                courseData[property] = null
            }
        }

        sequelize.sync().then(function () {

            Course.create({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            }).then(function () {
                resolve("operation successfull")
            }).catch(function (error) {
                reject("unable to create student");
            });


        });

    })

}

module.exports.getCourseByID = function (num) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: {
                courseId: num
            }
        }).then(function (data) {
            //console.log(data)
            resolve(data[0])
        }).catch(function (error) {
            reject("no results returned");
        });

    })
}

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        for (const property in studentData) {
            if (studentData[property] == "") {
                studentData[property] = null
            }
        }


        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update student"); return;
        });



    })
}

module.exports.updateCourse = function (courseData) {
    return new Promise((resolve, reject) => {
        for (const property in courseData) {
            if (courseData[property] == "") {
                courseData[property] = null
            }
        }

        Course.update(courseData, {
            where: {courseId :courseData.courseId}
        }).then(function () {
            resolve("operation successfull")
        }).catch(function (error) {
            reject("unable to update course");
        });



    })
}

module.exports.deleteCourseByID = function (id) {
    return new Promise((resolve, reject) => {

        sequelize.sync().then(function () {

            Course.destroy({
                where: {
                    courseId: id

                }
            }).then(function () {
                resolve("operation successfull")
            }).catch(function (error) {
                reject("no such id");
            });


        });
    })
}

module.exports.deleteStudentByNum = function (num) {
    return new Promise((resolve, reject) => {

        sequelize.sync().then(function () {

            Student.destroy({
                where: {
                    studentNum: num

                }
            }).then(function () {
                resolve("DELETE operation successfull")
            }).catch(function (error) {
                reject("no such num");
            });


        });
    })
}


