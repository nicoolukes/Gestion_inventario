class PersonaRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async agregarPersona(dataPersona) {
        const query = `
            INSERT INTO persona(dni, nombre, apellido, facultad, rol, telefono)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            dataPersona.dni,
            dataPersona.nombre,
            dataPersona.apellido,
            dataPersona.facultad,
            dataPersona.rol,
            dataPersona.telefono
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async modificarPersona(id, dataPersona) {
        const query = `
            UPDATE persona
            SET
                dni = $1,
                nombre = $2,
                apellido = $3,
                facultad = COALESCE($4, facultad),
                rol = COALESCE($5, rol),
                telefono = COALESCE($6, telefono)
            WHERE id_persona = $7
            RETURNING *;
        `;

        const values = [
            dataPersona.dni,
            dataPersona.nombre,
            dataPersona.apellido,
            dataPersona.facultad,
            dataPersona.rol,
            dataPersona.telefono,
            id
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async listarPersona() {
        const query = `
            SELECT * FROM persona;
        `;

        const result = await this.pool.query(query);
        return result.rows;
    }

    async eliminarPersona(id) {
        const query = `
            DELETE FROM persona
            WHERE id_persona = $1
            RETURNING *;
        `;

        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async buscarPorDni(dni) {
    const query = `
        SELECT * FROM persona
        WHERE dni = $1;
    `;

    const result = await this.pool.query(query, [dni]);
    return result.rows[0]; // devuelve undefined si no existe
}
}



module.exports = PersonaRepository;