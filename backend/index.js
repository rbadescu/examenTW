"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const sequelize = require("./sequelize");

const Spacecraft = require("./entities/Spacecraft");
const Astronaut = require("./entities/Astronaut");

Spacecraft.hasMany(Astronaut, { foreignKey: "idSpacecraft" });

app.use(
    express.urlencoded({
        extended: true,
    }));
app.use(express.json());

app.listen(port, () => {
    console.log(`API is running at port ${port}...`);
});

app.get("/create", async (request, response, next) => {
    try {
        await sequelize.sync({ force: true });
        response.sendStatus(204);

    } catch (error) {
        next(error);
    }
});

// ------------ Spacecraft ----------------

app.get("/spacecrafts", async (request, response, next) => {
    try {
        const Op = require("sequelize").Op;
        const query = {};
        let pageSize = 3;

        const allowedFilters = ["numeSpacecraft", "vitezaMax"];
        const filterKeys = Object.keys(request.query).filter(
            (e) => allowedFilters.indexOf(e) !== -1
        );

        if (filterKeys.length > 0) {
            query.where = {};

            for (const key of filterKeys) {
                if (isNaN(request.query[key]) == true) {
                    query.where[key] = { [Op.like]: `%${request.query[key]}%` };
                }
                else {
                    query.where[key] = {
                        [Op.eq]: parseFloat(request.query[key]),
                    };
                }
            }
        }

        if (request.query.pageSize) {
            pageSize = parseInt(request.query.pageSize);
        }

        if (request.query.sortField) {
            const sortField = request.query.sortField;
            const sortOrder = request.query.sortOrder ? request.query.sortOrder : 'ASC';
            query.order = [[sortField, sortOrder]];
        }

        if (!isNaN(parseInt(request.query.page))) {
            query.limit = pageSize;
            query.offset = pageSize * parseInt(request.query.page);
        }

        const data = await Spacecraft.findAll(query);
        const count = await Spacecraft.count();
        response.status(200).json({ data, count });

    } catch (e) {
        console.warn(e);
        response.status(500).json({ message: "server error" });
    }
});

// get
app.get("/spacecrafts/:idSpacecraft", async (req, res, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(req.params.idSpacecraft);

        if (spacecraft) {
            res.status(200).json(spacecraft);

        } else {
            res.status(404).json({
                error: `Nava cu id-ul ${req.params.idSpacecraft} nu exista!`,
            });
        }
    } catch (err) {
        next(err);
    }
});

// post
app.post("/spacecrafts", async (request, response, next) => {
    try {

        const spacecraft = await Spacecraft.create(request.body);
        response.status(201).json({ message: "Nava a fost adaugata!" });

    } catch (error) {
        next(error);
    }
});

// put
app.put("/spacecrafts/:idSpacecraft", async (req, res, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(req.params.idSpacecraft);

        if (spacecraft) {
            await spacecraft.update(req.body);

            res.status(200).json({
                message: `Nava cu id-ul ${req.params.idSpacecraft} a fost actualizata!`,
            });
        } else {
            res.status(404).json({
                error: `Nava cu id-ul ${req.params.idSpacecraft} nu exista!`,
            });
        }
    } catch (err) {
        next(err);
    }
});

//delete
app.delete("/spacecrafts/:idSpacecraft", async (req, res, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(req.params.idSpacecraft);

        if (spacecraft) {

            await spacecraft.destroy();
            res.status(200).json({
                message: `Nava cu id-ul ${req.params.idSpacecraft} a fost stearsa!`,
            });

        } else {
            res.status(404).json({
                error: `Nava cu id-ul ${req.params.idSpacecraft} nu exista!`,
            });
        }
    } catch (err) {
        next(err);
    }
});


// ------------ Astronaut ----------------

// get all
app.get("/spacecrafts/:idSpacecraft/astronauts", async (request, response, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(request.params.idSpacecraft);

        if (spacecraft) {

            const dataAstronauts = await spacecraft.getAstronauts();

            if (dataAstronauts.length > 0) {
                response.status(200).json({ dataAstronauts });

            } else {
                response.sendStatus(204);
            }
        } else {
            response.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
}
);

// get
app.get("/spacecrafts/:idSpacecraft/astronauts/:idAstronaut", async (req, res, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(req.params.idSpacecraft);

        if (spacecraft) {

            const dataAstronauts = await spacecraft.getAstronauts({
                where: { id: req.params.idAstronaut },
            });

            const astronaut = dataAstronauts.shift();

            if (astronaut) {
                res.status(200).json(astronaut);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.status(404).json({
                error: `Astronautul cu id-ul ${req.params.astronautId} nu exista!`,
            });
        }
    } catch (err) {
        next(error);
    }
}
);

// post
app.post("/spacecrafts/:idSpacecraft/astronauts", async (request, response, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(request.params.idSpacecraft);

        if (spacecraft) {

            const astronaut = await Astronaut.create(request.body);
            spacecraft.addAstronaut(astronaut);
            await spacecraft.save();
            response.status(200).json(astronaut);

        } else {
            response.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
}
);

// put
app.put("/spacecrafts/:idSpacecraft/astronauts/:idAstronaut", async (req, res, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(req.params.idSpacecraft);

        if (spacecraft) {

            const astronauts = await spacecraft.getAstronauts({ where: { id: req.params.idAstronaut } });
            const astronaut = astronauts.shift();

            if (astronaut) {
                await astronaut.update(req.body);
                res.status(200).json({
                    message: `Astronautul cu id-ul ${req.params.idAstronaut} a fost actualizat!`,
                });

            } else {
                res.status(404).json({
                    error: `Astronautul cu id-ul ${req.params.idAstronaut} nu exista!`,
                });
            }
        } else {
            response.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
}
);

// delete
app.delete("/spacecrafts/:idSpacecraft/astronauts/:idAstronaut", async (request, response, next) => {
    try {

        const spacecraft = await Spacecraft.findByPk(request.params.idSpacecraft);

        if (spacecraft) {

            const dataAstronauts = await spacecraft.getAstronauts({ where: { id: request.params.idAstronaut } });
            const astronaut = dataAstronauts.shift();

            if (astronaut) {

                await astronaut.destroy();
                response.status(200).json({
                    message: `Astronautul cu id-ul ${request.params.idAstronaut} a fost sters!`,
                });

            } else {
                response.status(404).json({
                    error: `Astronautul cu id-ul ${request.params.idAstronaut} nu exista!`,
                });
            }
        } else {
            response.status(404).json({
                error: `Nava cu id-ul ${request.params.idSpacecraft} nu exista!`,
            });
        }
    } catch (error) {
        next(error);
    }
}
);


// import
app.post("/import", async (request, response, next) => {
    try {
        const data = {};

        for (let s of request.body) {

            const spacecraft = await Spacecraft.create(s);

            for (let a of s.astronauts) {

                const astronaut = await Astronaut.create(a);
                data[a.key] = astronaut;
                spacecraft.addAstronaut(astronaut);

            }
            await spacecraft.save();
        }
        response.sendStatus(204);

    } catch (error) {
        next(error);
    }
});

app.get("/export", async (request, response, next) => {
    try {
        const data = [];

        for (let s of await Spacecraft.findAll()) {

            const spacecraft = {
                numeSpacecraft: s.numeSpacecraft,
                vitezaMax: s.vitezaMax,
                masa: s.masa,
                astronauts: [],

            };
            for (let a of await s.getAstronauts()) {
                spacecraft.astronauts.push({
                    key: a.id,
                    numeAstronaut: a.numeAstronaut,
                    rol: a.rol,
                });
            }
            data.push(spacecraft);
        }

        if (data.length > 0) {
            response.json(data);

        } else {
            response.sendStatus(204);
        }

    } catch (error) {
        next(error);
    }
});

