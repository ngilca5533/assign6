
/*********************************************************************************
* WEB700 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Nicholas Gilca Student ID: ngilca Date: 12/2/2022

* Online (Cyclic) Link: https://jealous-cowboy-hat-crab.cyclic.app

********************************************************************************/

const { resolve } = require("path");
const exphbs = require("express-handlebars");
var init = require("./module/collegeData.js");


var express = require("express");
var app = express();
const path = require("path");


//var students;


app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
var HTTP_port = process.env.PORT || 8080;

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');


app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

init.initialize().then((resolvedValue) => {
    //console.log("INITIALIZE SUCCESS")


}).catch((rejectedValue) => {
    console.log(rejectedValue);
})

app.get("/students", (req, res) => {


    if (req.query.course) {
        courseNum = req.query.course

        init.getStudentsByCourse(courseNum).then((resolve) => {
            //console.log(resolve);
            //res.send(resolve);
            res.render("students", {
                students: resolve
            })
        }).catch((reject) => {
            res.render("students", {
                message: "no results"
            })
        })
    } else {

        init.getAllStudents().then((resolve) => {
            //console.log("Successfully retrieved "+resolve+" students");
            //res.send(resolve);
            //console.log(resolve);
            if (resolve.length > 0) {
                res.render("students", {
                    students: resolve
                })
            } else {
                res.render("students", { message: "no results" })
            }
        }).catch((reject) => {
            //console.log(reject);
            res.render("students", { message: "no results" })
        })

    }
});

app.get("/tas", (req, res) => {
    init.getTAs().then((resolve) => {
        res.send(resolve);
    }).catch((reject) => {
        console.log(reject);
    })

})

app.get("/courses", (req, res) => {
    init.getCourses().then((resolve) => {
        //res.send(resolve);

        if (resolve.length > 0) {
            res.render("courses", {
                courses: resolve
            })
        } else {
            res.render("courses", { message: "no results" })
        }


    }).catch((reject) => {
        //console.log(reject);
        res.render("courses", { message: "no results" })
    })
})


// app.get("/student/:num", (req, res) => {
//     init.getStudentByNum(req.params.num).then((resolve) => {
//         //res.send(resolve);
//         res.render("student", { student: resolve })
//     }).catch((reject) => {
//         console.log(reject);
//     })

// })


app.get("/student/:num", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    init.getStudentByNum(req.params.num).then((data) => {
        console
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error
    }).then(init.getCourses)
        .then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {
            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
});

app.get("/course/:id", (req, res) => {
    init.getCourseByID(req.params.id).then((resolve) => {
        //res.send(resolve);
        console.log(resolve)
        res.render("course", { course: resolve })
    }).catch((reject) => {
        console.log(reject);
        res.status(404).send("Course Not Found");
    })

})

app.get("/course/delete/:id", (req, res) => {
    init.deleteCourseByID(req.params.id).then((resolve) => {
        //res.send(resolve);
        res.redirect("/courses")
    }).catch((reject) => {
        console.log(reject);
        res.status(500).send("Unable to Remove Course/Course Not Found");
    })

})

app.get("/student/delete/:num", (req, res) => {
    init.deleteStudentByNum(req.params.num).then((resolve) => {
        //res.send(resolve);
        console.log(resolve);
        res.redirect("/students")
    }).catch((reject) => {
        console.log(reject);
        res.status(500).send("Unable to Remove Student/Student Not Found");
    })

})


app.get("/", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile(path.join(__dirname, "/views/home.html"));
    res.render("home")
});


app.get("/about", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile(path.join(__dirname, "/views/about.html"));
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    res.render("htmlDemo")
});

app.get("/students/add", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile(path.join(__dirname, "/views/addStudent.html"));

    init.getCourses().then((resolve) => {
        //res.send(resolve);
        console.log(resolve)

        res.render("addStudent", { courses: resolve });

    }).catch((reject) => {
        //console.log(reject);
        res.render("addStudent", { courses: [] });
    })
    //res.render("addStudent")
});

app.post("/students/add", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;
    init.addStudent(req.body).then((resolve) => {
        //res.send(resolve);
        console.log(resolve)
        res.redirect("/students")
    }).catch((reject) => {
        console.log(reject);
    })
});

app.get("/courses/add", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile(path.join(__dirname, "/views/addStudent.html"));
    res.render("addCourse")
});

app.post("/courses/add", (req, res) => {
    init.addCourse(req.body).then((resolve) => {
        //res.send(resolve);
        console.log(resolve)
        res.redirect("/courses")
    }).catch((reject) => {
        console.log(reject);
    })
});




app.post("/student/update", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;
    console.log(req.body);
    console.log("UPDATE ROUTE HIT")

    init.updateStudent(req.body).then((resolve) => {
        console.log(resolve)
    }).catch((reject) => {
        console.log(reject);
    })


    res.redirect("/students");
});

app.post("/course/update", (req, res) => {
    console.log(req.body);

    init.updateCourse(req.body).then((resolve) => {
        console.log(resolve)
    }).catch((reject) => {
        console.log(reject);
    })


    res.redirect("/courses");
});






app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
    //res.status(404).end();
});




app.listen(HTTP_port, () => { console.log("server listening on port: " + HTTP_port) });



