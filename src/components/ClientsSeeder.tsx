import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { addClient } from '@/store/slices/clientsSlice';
import { AppDispatch } from '@/store';
import { useToast } from '@/components/ui/use-toast';

// Datos de ejemplo para 10 clientes
const sampleClients = [
  { 
    name: 'Bar El Rincón', 
    businessType: 'Bar',
    owner: 'Juan Pérez García',
    address: 'Calle Principal 123', 
    city: 'Madrid',
    province: 'Madrid',
    postalCode: '28001',
    phone: '655432187', 
    email: 'contacto@elrincon.com',
    taxId: 'B12345678',
    morningOpenTime: '10:00',
    morningCloseTime: '16:00',
    eveningOpenTime: '18:00',
    eveningCloseTime: '02:00',
    closingDay: 'Lunes',
    notes: 'Local con alta rotación de clientes',
    machines: 0
  },
  { 
    name: 'Cafetería Central', 
    businessType: 'Cafetería',
    owner: 'María García López',
    address: 'Av. Libertad 456', 
    city: 'Barcelona',
    province: 'Barcelona',
    postalCode: '08001',
    phone: '633456789',
    email: 'info@cafeteriacentral.com',
    taxId: 'B87654321',
    morningOpenTime: '08:00',
    morningCloseTime: '16:00',
    eveningOpenTime: '',
    eveningCloseTime: '20:00',
    closingDay: 'Domingo',
    notes: 'Especialidad en desayunos y meriendas',
    machines: 0
  },
  { 
    name: 'Restaurante Los Amigos', 
    businessType: 'Restaurante',
    owner: 'Carlos Ruiz Martínez',
    address: 'Plaza Mayor 789', 
    city: 'Valencia',
    province: 'Valencia',
    postalCode: '46001',
    phone: '644789123',
    email: 'info@losamigos.com',
    taxId: 'B98765432',
    morningOpenTime: '12:00',
    morningCloseTime: '16:00',
    eveningOpenTime: '19:00',
    eveningCloseTime: '00:00',
    closingDay: 'Martes',
    notes: 'Especialidad en arroces',
    machines: 0
  },
  {
    name: 'Pub Noche Loca',
    businessType: 'Pub',
    owner: 'Miguel Fernández Castro',
    address: 'Calle Fiesta 234',
    city: 'Sevilla',
    province: 'Sevilla',
    postalCode: '41001',
    phone: '688912345',
    email: 'contacto@nocheloca.com',
    taxId: 'B43219876',
    morningOpenTime: '12:00',
    morningCloseTime: '',
    eveningOpenTime: '',
    eveningCloseTime: '04:00',
    closingDay: 'Lunes',
    notes: 'Música en vivo los fines de semana',
    machines: 0
  },
  {
    name: 'Salón de Juegos Star',
    businessType: 'Salón de Juegos',
    owner: 'Elena Martín Rodríguez',
    address: 'Avenida del Juego 567',
    city: 'Málaga',
    province: 'Málaga',
    postalCode: '29001',
    phone: '677123456',
    email: 'info@salonstar.com',
    taxId: 'B56789012',
    morningOpenTime: '10:00',
    morningCloseTime: '',
    eveningOpenTime: '',
    eveningCloseTime: '22:00',
    closingDay: 'Ninguno',
    notes: 'Gran variedad de máquinas recreativas',
    machines: 0
  },
  {
    name: 'Bar Deportivo Gol',
    businessType: 'Bar',
    owner: 'Alberto Sánchez Moreno',
    address: 'Calle del Deporte 789',
    city: 'Bilbao',
    province: 'Vizcaya',
    postalCode: '48001',
    phone: '622345678',
    email: 'bargol@deportivo.com',
    taxId: 'B23456789',
    morningOpenTime: '09:00',
    morningCloseTime: '16:00',
    eveningOpenTime: '18:00',
    eveningCloseTime: '01:00',
    closingDay: 'Miércoles',
    notes: 'Transmisión de eventos deportivos',
    machines: 0
  },
  {
    name: 'Cafetería Dulce Aroma',
    businessType: 'Cafetería',
    owner: 'Laura Torres Gil',
    address: 'Plaza del Café 101',
    city: 'Zaragoza',
    province: 'Zaragoza',
    postalCode: '50001',
    phone: '644567890',
    email: 'info@dulcearoma.com',
    taxId: 'B34567890',
    morningOpenTime: '07:00',
    morningCloseTime: '',
    eveningOpenTime: '',
    eveningCloseTime: '21:00',
    closingDay: 'Domingo',
    notes: 'Repostería casera',
    machines: 0
  },
  {
    name: 'Centro Recreativo Diversión',
    businessType: 'Centro Recreativo',
    owner: 'Javier López Navarro',
    address: 'Avenida Central 202',
    city: 'Alicante',
    province: 'Alicante',
    postalCode: '03001',
    phone: '655678901',
    email: 'contacto@diversion.com',
    taxId: 'B45678901',
    morningOpenTime: '10:00',
    morningCloseTime: '14:00',
    eveningOpenTime: '16:00',
    eveningCloseTime: '22:00',
    closingDay: 'Jueves',
    notes: 'Zona para niños y adultos',
    machines: 0
  },
  {
    name: 'Restaurante El Mediterráneo',
    businessType: 'Restaurante',
    owner: 'Sofía Gómez Hernández',
    address: 'Paseo Marítimo 303',
    city: 'Palma de Mallorca',
    province: 'Islas Baleares',
    postalCode: '07001',
    phone: '699789012',
    email: 'reservas@elmediterraneo.com',
    taxId: 'B56789012',
    morningOpenTime: '11:00',
    morningCloseTime: '16:00',
    eveningOpenTime: '19:00',
    eveningCloseTime: '23:00',
    closingDay: 'Ninguno',
    notes: 'Especialidad en pescado fresco',
    machines: 0
  },
  {
    name: 'Pub Rock Star',
    businessType: 'Pub',
    owner: 'Daniel Castro Ruiz',
    address: 'Calle de la Música 404',
    city: 'Murcia',
    province: 'Murcia',
    postalCode: '30001',
    phone: '611890123',
    email: 'info@rockstar.com',
    taxId: 'B67890123',
    morningOpenTime: '12:00',
    morningCloseTime: '',
    eveningOpenTime: '',
    eveningCloseTime: '03:00',
    closingDay: 'Lunes',
    notes: 'Conciertos en vivo los sábados',
    machines: 0
  }
];

const ClientsSeeder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const handleAddSampleClients = async () => {
    let addedCount = 0;
    
    for (const client of sampleClients) {
      try {
        await dispatch(addClient(client)).unwrap();
        addedCount++;
      } catch (error) {
        console.error('Error al añadir cliente:', error);
      }
    }
    
    toast({
      title: "Clientes añadidos",
      description: `Se han añadido ${addedCount} clientes de ejemplo correctamente.`,
      duration: 5000,
    });
  };
  
  return (
    <div className="py-4">
      <Button onClick={handleAddSampleClients} variant="default">
        Añadir 10 Clientes de Ejemplo
      </Button>
    </div>
  );
};

export default ClientsSeeder;
