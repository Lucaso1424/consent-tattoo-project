export class Cliente {
    nombre: string;
    apellidos: string;
    email: string;
    edad?: number;
    nif: string;
    fechaNacimiento: string;
    direccion: string;
    nameTutor?: string;
    ageTutor?: string;
    nifTutor?: string;
    poblacion: string;
    provincia: string;
    codPostal?: string;
    telefonoFijo?: number;
    movil?: number;
    fotoDni?: File;
    firma: string;

    constructor(data: any) {
        this.nombre = data.nombre; 
        this.apellidos = data.apellidos; 
        this.email = data.email; 
        this.edad = data.edad; 
        this.nif = data.nif; 
        this.fechaNacimiento = data.fechaNacimiento; 
        this.direccion = data.direccion; 
        this.nameTutor = data.nameTutor; 
        this.ageTutor = data.ageTutor; 
        this.poblacion = data.poblacion; 
        this.provincia = data.provincia; 
        this.codPostal = data.codPostal; 
        this.telefonoFijo = data.telefonoFijo; 
        this.movil = data.movil; 
        this.firma = data.firma;
    }
}