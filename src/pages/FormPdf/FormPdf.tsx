import { useState } from "react";
import { Button } from "../../components/Button/Button";
import type { User } from "../../models/User";

type UserWithImage = User & {
    image?: File;
};

export default function FormPdf() {
    const [formData, setFormData] = useState<User>({
    nombre: "",
    apellidos: "",
    email: "",
    edad: 0,
    address: "",
    nameTutor: "",
    ageTutor: 0,
    poblacion: "",
    provincia: "",
    telefonoFijo: 0,
    movil: 0,
    fechaNacimiento: "",
    image: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
    }));
    };

    const handleSubmit = () => {
        const requiredFields: (keyof User)[] = [
            "nombre",
            "apellidos",
            "email",
            "edad",
            "address",
            "poblacion",
            "provincia",
            "movil",
            "fechaNacimiento",
        ];

        const emptyFields = requiredFields.filter((field) => {
            const value = formData[field];
            return value === "" || value === null || value === undefined || value === 0;
        });
        if (emptyFields.length > 0) {
            alert(`Faltan estos campos obligatorios: ${emptyFields.join(", ")}`);
            return;
        }
        console.log("Usuario:", formData);
    };


    return (
        <div>
            {" "}
            <h2>Rellena los datos del formulario</h2>{" "}
            <div className="form-group">
            {" "}
            <div className="row">
                {" "}
                <div className="col-12">
                {" "}
                <label htmlFor="nombre">Nombre</label>{" "}
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />{" "}
                </div>
                <div className="col-12">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="age">Edad</label>
                <input
                    type="number"
                    id="edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="lastName">DNI/NIE</label>
                <input
                    type="file"
                    id="nif"
                    name="nif"
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setFormData((prev) => ({
                        ...prev,
                        image: file,
                        }));
                    }
                }}
                />
                </div>
                <div className="col-12">
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="address">Dirección</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="nameTutor">Padre/Madre tutor/a de:</label>
                <input
                    type="text"
                    id="nameTutor"
                    name="nameTutor"
                    value={formData.nameTutor}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="ageTutor">Edad de Padre/Madre tutor/a:</label>
                <input
                    type="number"
                    id="ageTutor"
                    name="ageTutor"
                    value={formData.ageTutor}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="poblacion">Población</label>
                <input
                    type="text"
                    id="poblacion"
                    name="poblacion"
                    value={formData.poblacion}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="provincia">Provincia</label>
                <input
                    type="text"
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="telefonoFijo">Tlf. fijo</label>
                <input
                    type="number"
                    id="telefonoFijo"
                    name="telefonoFijo"
                    value={formData.telefonoFijo}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="movil">Móvil</label>
                <input
                    type="number"
                    id="movil"
                    name="movil"
                    value={formData.movil}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                />
                </div>
            </div>
            <Button text="Enviar" action={handleSubmit} />
            </div>
        </div>
    );
}
