import { useState } from "react";
import type { Cliente } from "../../models/Cliente";
import { PDFDocument, rgb } from "pdf-lib";
import pdfBase from "/assets/consentimiento-informado-tatuajes-piercing.pdf";
import { useNavigate } from "react-router-dom";
import type { Tatuador } from "../../models/Tatuador";
import { Box, VStack, HStack, Input, Heading, Button, Text } from "@chakra-ui/react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

async function generatePdf(formData: Cliente, formDataTatuador: Tatuador) {
    const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const fontSize = 10;

    firstPage.drawText(`${formData.nombre} ` + `${formData.apellidos}`, { x: 90, y: 585, size: fontSize, color: rgb(0, 0, 0) });
    firstPage.drawText(`${formData.edad}`, { x: 500, y: 585, size: fontSize });                              

    firstPage.drawText(`${formData.nameTutor}`, { x: 155, y: 573, size: fontSize });                         
    firstPage.drawText(`${formData.ageTutor ?? ""}`, { x: 500, y: 573, size: fontSize });                          

    firstPage.drawText(`${formData.direccion}`, { x: 90, y: 560, size: fontSize });                          

    firstPage.drawText(`${formData.poblacion}`, { x: 90, y: 550, size: fontSize });                          
    firstPage.drawText(`${formData.codPostal ?? ""}`, { x: 270, y: 550, size: fontSize });                         
    firstPage.drawText(`${formData.provincia}`, { x: 380, y: 550, size: fontSize });                        

    firstPage.drawText(`${formData.telefonoFijo ?? ""}`, { x: 90, y: 539, size: fontSize });                      
    firstPage.drawText(`${formData.movil ?? ""}`, { x: 260, y: 539, size: fontSize });                             
    firstPage.drawText(`${new Date(formData.fechaNacimiento).toLocaleDateString()}`, { x: 445, y: 538, size: fontSize });   

    if (formData.fotoDni instanceof File) {
        const imageBytes = await formData.fotoDni.arrayBuffer();

        let image;
        if (formData.fotoDni.type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes);
        } else {
            image = await pdfDoc.embedJpg(imageBytes);
        }

        const scaled = image.scale(0.13);

        firstPage.drawImage(image, {
            x: 340, 
            y: 630, 
            width: scaled.width,
            height: scaled.height,
        });
    }

    const secondPage = pages[1];

    secondPage.drawText(`${formDataTatuador.tecnica}`, { x: 90, y: 430, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(`${formDataTatuador.zona}`, { x: 385, y: 430, size: fontSize, color: rgb(0, 0, 0) });


    secondPage.drawText(`${formDataTatuador.color}`, { x: 250, y: 385, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(`${formDataTatuador.marca}`, { x: 70, y: 385, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(`${formDataTatuador.lote}`, { x: 380, y: 385, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(`${new Date(formDataTatuador.fechaCaducidad).toLocaleDateString()}`, { x: 500, y: 385, size: fontSize, color: rgb(0, 0, 0) });


    secondPage.drawText(`${formData.nif}`, { x: 90, y: 125, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(`${formData.nombre} ` + `${formData.apellidos}`, { x: 365, y: 125, size: fontSize, color: rgb(0, 0, 0) });

    const today = new Date();

    secondPage.drawText(`Madrid`, { x: 285, y: 195, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(today.getDate().toString(), { x: 365, y: 195, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText((today.getMonth() + 1).toString(), { x: 400, y: 195, size: fontSize, color: rgb(0, 0, 0) });
    secondPage.drawText(today.getFullYear().toString(), { x: 500, y: 195, size: fontSize, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

async function downloadPdf(formData: Cliente, formDataTatuador: Tatuador) {
    const pdfBlob = await generatePdf(formData, formDataTatuador);
    const url = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "consentimiento_impala_tattoo_" + formData.nombre + "_" + formData.apellidos + ".pdf";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Formulario descargado correctamente", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default function FormPdf() {
    const [formData, setFormData] = useState<Cliente>({
        nombre: "",
        apellidos: "",
        email: "",
        edad: undefined,
        direccion: "",
        nameTutor: "",
        ageTutor: undefined,
        poblacion: "",
        codPostal: undefined,
        provincia: "",
        telefonoFijo: undefined,
        movil: undefined,
        fechaNacimiento: "",
        nif: "",
        fotoDni: undefined
    });

    const [formDataTatuador, setFormDataTatuador] = useState<Tatuador>({
        nombreTatuador: '',
        tecnica: '',
        zona: '',
        lote: undefined,
        fechaCaducidad: '',
        marca: ''
    });

    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; 

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeTatuador = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target; 

        setFormDataTatuador((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        const requiredFields: (keyof Cliente)[] = [
            "nombre",
            "apellidos",
            "email",
            "edad",
            "direccion",
            "poblacion",
            "provincia",
            "movil",
            "codPostal",
            "fechaNacimiento",
            "fotoDni",
            "nif"
        ];

        const emptyFields = requiredFields.filter((field) => {
            const value = formData[field];
            console.log(value)
            return value === "" || value === null || value === undefined || value === 0;
        });
        console.log(emptyFields)
        if (emptyFields.length > 0) {
            toast.error(`Faltan estos campos obligatorios del tatuador: ${emptyFields.join(", ")}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    maxWidth: "600px",       
                    whiteSpace: "pre-wrap",  
                    wordBreak: "break-word", 
                },
            });            
            return;
        }

        const requiredTatuadorFields: (keyof Tatuador)[] = [
            "nombreTatuador"
        ];

        const emptyTatuadorFields = requiredTatuadorFields.filter((field) => {
            const value = formDataTatuador[field];
            return value === "" || value === null || value === undefined || value === 0;
        });
        if (emptyTatuadorFields.length > 0) {
            toast.error(`Faltan estos campos obligatorios del tatuador: ${emptyTatuadorFields.join(", ")}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    maxWidth: "600px",       
                    whiteSpace: "pre-wrap",  
                    wordBreak: "break-word", 
                },
            });
            return;
        }

        await downloadPdf(formData, formDataTatuador)
    };


    return (
    <Box p={8} maxW="900px" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="2xl">
        <Heading as="h1" mb={6} color="teal.600" textAlign="center">
        Rellena los datos del formulario
        </Heading>

        <Box mb={8}>
        <Heading as="h2" size="md" mb={4} color="purple.600">
            Datos cliente
        </Heading>
        <VStack direction="column" gap="16px" align="stretch">
            <Box>
            <Text fontWeight="bold">Nombre</Text>
            <Input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Apellidos</Text>
            <Input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Edad</Text>
            <Input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="Edad"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">DNI/NIE</Text>
            <Input
                type="text"
                id="nif"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                placeholder="DNI/NIE"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">DNI/NIE (foto)</Text>
            <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    setFormData((prev) => ({
                    ...prev,
                    fotoDni: file,
                    }));
                }
                }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Email</Text>
            <Input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Dirección</Text>
            <Input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Heading as="h3" size="sm" mt={6} mb={4} color="purple.500">
            Datos del tutor
            </Heading>

            <Box>
            <Text fontWeight="bold">Padre/Madre tutor/a de:</Text>
            <Input
                type="text"
                id="nameTutor"
                name="nameTutor"
                value={formData.nameTutor}
                onChange={handleChange}
                placeholder="Nombre del tutor"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Edad de Padre/Madre tutor/a:</Text>
            <Input
                type="number"
                id="ageTutor"
                name="ageTutor"
                value={formData.ageTutor ?? ""}
                onChange={handleChange}
                placeholder="Edad"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">C.P</Text>
            <Input
                type="number"
                id="codPostal"
                name="codPostal"
                value={formData.codPostal ?? ""}
                onChange={handleChange}
                placeholder="Código Postal"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Población</Text>
            <Input
                type="text"
                id="poblacion"
                name="poblacion"
                value={formData.poblacion}
                onChange={handleChange}
                placeholder="Población"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Provincia</Text>
            <Input
                type="text"
                id="provincia"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                placeholder="Provincia"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Tlf. fijo</Text>
            <Input
                type="number"
                id="telefonoFijo"
                name="telefonoFijo"
                value={formData.telefonoFijo ?? ""}
                onChange={handleChange}
                placeholder="Teléfono fijo"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Móvil</Text>
            <Input
                type="number"
                id="movil"
                name="movil"
                value={formData.movil}
                onChange={handleChange}
                placeholder="Móvil"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Fecha de nacimiento</Text>
            <Input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>
        </VStack>
        </Box>

        <Box mb={8}>
        <Heading as="h2" size="md" mb={4} color="purple.600">
            Datos tatuador
        </Heading>
        <VStack direction="column" gap="16px" align="stretch">
            <Box>
            <Text fontWeight="bold">Nombre tatuador</Text>
            <Input
                type="text"
                id="nombreTatuador"
                name="nombreTatuador"
                value={formDataTatuador.nombreTatuador}
                onChange={handleChangeTatuador}
                placeholder="Nombre del tatuador"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Técnica</Text>
            <Input
                type="text"
                id="tecnica"
                name="tecnica"
                value={formDataTatuador.tecnica}
                onChange={handleChangeTatuador}
                placeholder="Técnica"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Zona</Text>
            <Input
                type="text"
                id="zona"
                name="zona"
                value={formDataTatuador.zona}
                onChange={handleChangeTatuador}
                placeholder="Zona"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Lote</Text>
            <Input
                type="text"
                id="lote"
                name="lote"
                value={formDataTatuador.lote}
                onChange={handleChangeTatuador}
                placeholder="Lote"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Marca</Text>
            <Input
                type="text"
                id="marca"
                name="marca"
                value={formDataTatuador.marca}
                onChange={handleChangeTatuador}
                placeholder="Marca"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Color</Text>
            <Input
                type="text"
                id="color"
                name="color"
                value={formDataTatuador.color}
                onChange={handleChangeTatuador}
                placeholder="Color"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Fecha de caducidad</Text>
            <Input
                type="date"
                id="fechaCaducidad"
                name="fechaCaducidad"
                value={formDataTatuador.fechaCaducidad}
                onChange={handleChangeTatuador}
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>
        </VStack>
        </Box>

        <HStack direction="column" gap="16px" justify="center">
        <Button colorScheme="black" backgroundColor={"black"} onClick={handleSubmit}>
            Enviar
        </Button>
        <Button colorScheme="black" backgroundColor={"black"} onClick={() => goToHome()}>
            Volver
        </Button>
        </HStack>
        <ToastContainer />
    </Box>
    );

}