class PersonaService {
    constructor(personaRepository) {
        this.personaRepository = personaRepository;
    }

    async agregarPersona(dataPersona) {

        if (!dataPersona.dni || isNaN(dataPersona.dni)) {
            throw Error("El DNI es obligatorio y debe ser numérico");
        }

        if (!dataPersona.nombre || !dataPersona.apellido) {
            throw Error("Nombre y apellido son obligatorios");
        }

        if (dataPersona.rol && !["ADMIN", "EMPLEADO"].includes(dataPersona.rol)) {
            throw Error("Rol inválido");
        }

        // Verificar si el DNI ya existe
        const personaExistente = await this.personaRepository.buscarPorDni(dataPersona.dni);
        if (personaExistente) {
            throw Error("El DNI ya está registrado");
        }

        const mensaje = await this.personaRepository.agregarPersona(dataPersona);
        return mensaje;
    }

    async modificarPersona(id, dataPersona) {

        if (!id || isNaN(id)) {
            throw Error("El id es inválido");
        }

        if (dataPersona.dni && isNaN(dataPersona.dni)) {
            throw Error("El DNI debe ser numérico");
        }

        if (dataPersona.rol && !["ADMIN", "EMPLEADO"].includes(dataPersona.rol)) {
            throw Error("Rol inválido");
        }

        const mensaje = await this.personaRepository.modificarPersona(id, dataPersona);
        return mensaje;
    }

    async listarPersona() {

        const personas = await this.personaRepository.listarPersona();

        if (!personas || personas.length === 0) {
            return [];
        }

        return personas;
    }

    async eliminarPersona(id) {

        if (!id || isNaN(id)) {
            throw Error("El id es inválido");
        }

        const personaEliminada = await this.personaRepository.eliminarPersona(id);

        if (!personaEliminada) {
            throw Error("Persona no encontrada");
        }

        return personaEliminada;
    }
}

module.exports = PersonaService;