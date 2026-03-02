class PersonaController {
    constructor(personaService) {
        this.personaService = personaService;
    }

    async agregarPersona(req, res) {
        try {
            const dataPersona = {
                dni: req.body.dni,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                facultad: req.body.facultad,
                rol: req.body.rol,
                telefono: req.body.telefono
            };

            const mensaje = await this.personaService.agregarPersona(dataPersona);
            return res.status(201).json(mensaje);

        } catch (error) {
            console.error("❌ ERROR REAL:", error);
            return res.status(500).json({
                error: "Error al cargar persona",
                detalle: error.message
            });
        }
    }

    async modificarPersona(req, res) {
        try {
            const { id } = req.params;

            const dataPersona = {
                dni: req.body.dni,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                facultad: req.body.facultad,
                rol: req.body.rol,
                telefono: req.body.telefono
            };

            const mensaje = await this.personaService.modificarPersona(id, dataPersona);
            return res.status(200).json(mensaje);

        } catch (error) {
            console.error("❌ ERROR REAL:", error);
            return res.status(500).json({
                error: "Error al modificar persona",
                detalle: error.message
            });
        }
    }

    async listarPersona(req, res) {
        try {
            const personas = await this.personaService.listarPersona();
            return res.status(200).json(personas);

        } catch (error) {
            console.error("❌ ERROR REAL:", error);
            return res.status(500).json({
                error: "Error al listar personas",
                detalle: error.message
            });
        }
    }

    async eliminarPersona(req, res) {
        try {
            const { id } = req.params;

            const mensaje = await this.personaService.eliminarPersona(id);
            return res.status(200).json(mensaje);

        } catch (error) {
            console.error("❌ ERROR REAL:", error);
            return res.status(500).json({
                error: "Error al eliminar persona",
                detalle: error.message
            });
        }
    }
}

module.exports = PersonaController;