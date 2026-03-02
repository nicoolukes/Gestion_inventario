class AsignarController {
    constructor(asigService) {
        this.asigService = asigService;
    }

    async registrarAsignacion(req, res, next) {
        try {
            const dataAsig = {
                id_turno: req.body.id_turno,
                id_persona: req.body.id_persona
            };
            if (!dataAsig.id_persona && !dataAsig.id_turno) {
                throw ErrorsFactory.badRequest("El turno o la persona son invalidos")
            }
            const mensaje = await this.asigService.registrarAsignacion(dataAsig);
            return res.status(201).json(mensaje);
        } catch (error) {
            next(error);
        }
    }

    async modificarAsignacion(req, res, next) {
        try {
            const mensaje = await this.asigService.modificarAsignacion();
            return res.status(200).json(mensaje);
        } catch (error) {
            next(error);
        }

    }

    async buscarAsignacion(req, res, next){
        try{
            const asignacion = await this.buscarAsignacion();
            return res.status(200).json(asignacion);
        }catch(error){
            next(error)
        }
    }
}

module.exports = AsignarController;