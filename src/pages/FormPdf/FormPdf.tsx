import { useState } from "react";
import { Button } from "../../components/Button/Button";
import type { User } from "../../models/User";
import { PDFDocument, rgb } from "pdf-lib";
import pdfBase from "/assets/consentimiento-informado-tatuajes-piercing.pdf";
// import nodemailer from "nodemailer";

type UserWithImage = User & {
    image?: File;
};

async function generatePdf(formData: User) {
    const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const fontSize = 10;

    firstPage.drawText(`${formData.nombre}`, { x: 90, y: 585, size: fontSize, color: rgb(0, 0, 0) });      
    firstPage.drawText(`${formData.edad}`, { x: 500, y: 585, size: fontSize });                              

    firstPage.drawText(`${formData.nameTutor}`, { x: 155, y: 573, size: fontSize });                         
    firstPage.drawText(`${formData.ageTutor}`, { x: 500, y: 573, size: fontSize });                          

    firstPage.drawText(`${formData.direccion}`, { x: 90, y: 560, size: fontSize });                          

    firstPage.drawText(`${formData.poblacion}`, { x: 90, y: 550, size: fontSize });                          
    firstPage.drawText(`${formData.codPostal}`, { x: 320, y: 550, size: fontSize });                         
    firstPage.drawText(`${formData.provincia}`, { x: 360, y: 560, size: fontSize });                        

    firstPage.drawText(`${formData.telefonoFijo}`, { x: 90, y: 545, size: fontSize });                      
    firstPage.drawText(`${formData.movil}`, { x: 260, y: 545, size: fontSize });                             
    firstPage.drawText(`${formData.fechaNacimiento}`, { x: 445, y: 535, size: fontSize });   
    // firstPage.drawText(`${formData.image}`, { x: 445, y: 545, size: fontSize });   

    const pdfBytes = await pdfDoc.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

async function downloadPdf(formData: User) {
  const pdfBlob = await generatePdf(formData);
  const url = URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "consentimiento_impala_prueba.pdf";
  link.click();

  URL.revokeObjectURL(url);
};

// const transporter = nodemailer.createTransport({
//     service: "gmail", // o SMTP de tu proveedor
//     auth: { user: "email@gmail.com", pass: "pass" },
// });

export default function FormPdf() {
    const [formData, setFormData] = useState<User>({
        nombre: "",
        apellidos: "",
        email: "",
        edad: 0,
        direccion: "",
        nameTutor: "",
        ageTutor: 0,
        poblacion: "",
        codPostal: 0,
        provincia: "",
        telefonoFijo: 0,
        movil: 0,
        fechaNacimiento: "",
        nif: "",
        image: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
    }));
    };

    const handleSubmit = async () => {
        const requiredFields: (keyof User)[] = [
            "nombre",
            "apellidos",
            "email",
            "edad",
            "direccion",
            "poblacion",
            "provincia",
            "movil",
            "fechaNacimiento",
            "image",
            "nif"
        ];

        const emptyFields = requiredFields.filter((field) => {
            const value = formData[field];
            return value === "" || value === null || value === undefined || value === 0;
        });
        if (emptyFields.length > 0) {
            alert(`Faltan estos campos obligatorios: ${emptyFields.join(", ")}`);
            return;
        }

        await downloadPdf(formData)

        // const pdfBlob = await generatePdf(formData);
        // const arrayBuffer = await pdfBlob.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);
        // transporter.sendMail({
        //     from: "email@gmail.com",
        //     to: "email@gmail.com",
        //     subject: "Formulario con PDF",
        //     text: "Adjunto el formulario en PDF",
        //     attachments: [{ filename: "consentimiento_impala_prueba.pdf", content: buffer }],
        // });
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
                <label htmlFor="age">DNI/NIE</label>
                <input
                    type="text"
                    id="nif"
                    name="nif"
                    value={formData.nif}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="lastName">DNI/NIE (foto)</label>
                <input
                    type="file"
                    id="image"
                    name="image"
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
                <label htmlFor="direccion">Dirección</label>
                <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                />
                </div>
                <div className="col-12">
                <label htmlFor="cp">C.P</label>
                <input
                    type="number"
                    id="cp"
                    name="cp"
                    value={formData.codPostal}
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