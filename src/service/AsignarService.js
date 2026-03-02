const ErrorsFactory = require("../errors/ErrorsFactory");

class AsingnarService {
    constructor(asignarRepository, cajaRepository) {
        this.asignarRepository = asignarRepository;
        this.cajaRepository = cajaRepository;
    }

    async registrarAsignacion(dataAsig) {

        const turnoLibre = await this.asignarRepository.buscarAsignacion();

        if (turnoLibre !== null) {
            throw ErrorsFactory.conflict("Hay un turno libre");
        }

        const montoCaja = await this.cajaRepository.getSaldo();
        const dataAsigM = {
            ...dataAsig,
            dinero_inicio: montoCaja
        }

        const mensaje = await this.asignarRepository.registrarAsignacion(dataAsigM);
        return mensaje;
    }

    async modificarAsignacion() {
        const turnoLibre = await this.asignarRepository.buscarAsignacion();

        if (!turnoLibre) {
            throw ErrorsFactory.notFound("no existe un turno abierto")
        }

        const montoCaja = await this.cajaRepository.getSaldo();
        const dataAsig = {
            id_asignacion: turnoLibre.id_asignacion,
            dinero_fin: montoCaja
        }

        const mensaje = await this.asignarRepository.modificarAsignacion(dataAsig);
        return mensaje;
    }

    async buscarAsignacion() {
        const turnoLibre = await this.asignarRepository.buscarAsignacion();

        if (!turnoLibre) {
            throw ErrorsFactory.notFound("no existe un turno abierto")
        }

        return turnoLibre;
    }
}

module.exports = AsingnarService;