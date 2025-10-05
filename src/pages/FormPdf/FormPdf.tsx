import { useRef, useState, type CSSProperties } from "react";
import type { Cliente } from "../../models/Cliente";
import { useNavigate } from "react-router-dom";
import type { Tatuador } from "../../models/Tatuador";
import { Box, VStack, HStack, Input, Heading, Button, Text } from "@chakra-ui/react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Utils } from "../../utils/Utils";
import CanvasDraw from "react-canvas-draw";

export default function FormPdf() {
    const [formData, setFormData] = useState<Cliente>({
        nombre: "",
        apellidos: "",
        email: "",
        edad: undefined,
        direccion: "",
        nameTutor: "",
        ageTutor: undefined,
        nifTutor: '',
        poblacion: "",
        codPostal: undefined,
        provincia: "",
        telefonoFijo: undefined,
        movil: undefined,
        fechaNacimiento: "",
        nif: "",
        fotoDni: undefined,
        firma: ""
    });

    const [formDataTatuador, setFormDataTatuador] = useState<Tatuador>({
        nombreTatuador: '',
        nifTatuador: '',
        tecnica: '',
        zona: '',
        lote: undefined,
        fechaCaducidad: '',
        marca: '',
        diseño: '',
        nombreAplicador: '',
        redSocial: ''
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
        if (canvasRef.current) {
            const saveData = canvasRef.current.getSaveData();
            const data = JSON.parse(saveData);
            
            if (!data || !data.lines || data.lines.length === 0) {
                toast.error("Por favor, firma el formulario antes de enviarlo.", {
                    position: "top-right",
                });
                return;
            }

            const imageData: string = canvasRef.current.canvas.drawing.toDataURL("image/png");

            formData.firma = imageData;
        }
        

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
            "nif",
        ];

        const emptyFields = requiredFields.filter((field) => {
            const value = formData[field];
            console.log(value)
            return value === "" || value === null || value === undefined || value === 0;
        });
        console.log(emptyFields)
        if (emptyFields.length > 0) {
            toast.error(`Faltan estos campos obligatorios del cliente: ${emptyFields.join(", ")}`, {
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
            'nombreTatuador',
            'nifTatuador'
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

        await Utils.downloadPdf(formData, formDataTatuador)
    };

    const canvasDrawCSSProperties: CSSProperties = {
        border: "1px solid #000",
        borderRadius: "4px",
        width: "100%",
        minWidth: "280px",
        maxWidth: "600px",
        height: "200px",
        backgroundColor: "white",
        touchAction: "none",
        margin: "0 auto",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    };
    const canvasRef = useRef<CanvasDraw>(null);

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
                capture="environment"
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
            <Text fontWeight="bold">NIF/NIE de Padre/Madre tutor/a:</Text>
            <Input
                type="string"
                id="nifTutor"
                name="nifTutor"
                value={formData.nifTutor ?? ""}
                onChange={handleChange}
                placeholder="NIF/NIE Tutor Legal"
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
            <Text fontWeight="bold">NIF Tatuador</Text>
            <Input
                type="text"
                id="nifTatuador"
                name="nifTatuador"
                value={formDataTatuador.nifTatuador}
                onChange={handleChangeTatuador}
                placeholder="NIF del tatuador"
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
            <Text fontWeight="bold">Diseño</Text>
            <Input
                type="text"
                id="diseño"
                name="diseño"
                value={formDataTatuador.diseño}
                onChange={handleChangeTatuador}
                placeholder="Diseño"
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
            <Text fontWeight="bold">Nombre aplicador</Text>
            <Input
                type="text"
                id="nombreAplicador"
                name="nombreAplicador"
                value={formDataTatuador.nombreAplicador}
                onChange={handleChangeTatuador}
                placeholder="Nombre aplicador"
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

            <Box>
            <Text fontWeight="bold">¿Cómo nos conociste?</Text>
            <Input
                type="text"
                id="redSocial"
                name="redSocial"
                value={formDataTatuador.redSocial}
                onChange={handleChangeTatuador}
                placeholder="¿Cómo nos conociste?"
                _focus={{ borderColor: "teal.400" }}
            />
            </Box>

            <Box>
            <Text fontWeight="bold">Firma aquí</Text>
                <CanvasDraw ref={canvasRef} style={canvasDrawCSSProperties}  brushRadius={1} />
                <Button colorScheme="black" margin={2} backgroundColor={"grey"} onClick={() => canvasRef.current?.clear()}>
                    Deshacer
                </Button>
            </Box>
        </VStack>
        </Box>

        <HStack direction="column" gap="16px" justify="center">
        <Button colorScheme="black" backgroundColor={"grey"} onClick={handleSubmit}>
            Enviar
        </Button>
        <Button colorScheme="black" backgroundColor={"grey"} onClick={() => goToHome()}>
            Volver
        </Button>
        </HStack>
        <ToastContainer />
    </Box>
    );

}