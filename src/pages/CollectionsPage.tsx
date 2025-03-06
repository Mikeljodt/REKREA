import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Download, Upload, Search, File, FileText } from 'lucide-react';

// Mock data for collections
const mockCollections = [
  { id: 'R001', date: '2023-06-01', client: 'Bar El Rincón', machines: 3, amount: 320, technician: 'Carlos Gómez' },
  { id: 'R002', date: '2023-06-02', client: 'Cafetería Central', machines: 2, amount: 280, technician: 'María López' },
  { id: 'R003', date: '2023-06-05', client: 'Restaurante Los Amigos', machines: 1, amount: 150, technician: 'Carlos Gómez' },
  { id: 'R004', date: '2023-06-07', client: 'Pub La Noche', machines: 4, amount: 410, technician: 'María López' },
  { id: 'R005', date: '2023-06-10', client: 'Cafetería Aroma', machines: 2, amount: 210, technician: 'Carlos Gómez' },
];

const CollectionsPage = () => {
  const [collections] = useState(mockCollections);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollections = collections.filter(collection => 
    collection.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recaudaciones</h1>
          <p className="text-muted-foreground">Gestiona los registros de recaudación de tus máquinas.</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" /> Nueva Recaudación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Recaudación</DialogTitle>
                <DialogDescription>
                  Ingresa los datos de la recaudación realizada.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4 py-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="client">Cliente</Label>
                  <select 
                    id="client"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar cliente</option>
                    <option value="Bar El Rincón">Bar El Rincón</option>
                    <option value="Cafetería Central">Cafetería Central</option>
                    <option value="Restaurante Los Amigos">Restaurante Los Amigos</option>
                  </select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="amount">Importe Total</Label>
                  <Input id="amount" type="number" min="0" step="0.01" placeholder="0.00" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="technician">Técnico</Label>
                  <select 
                    id="technician"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar técnico</option>
                    <option value="Carlos Gómez">Carlos Gómez</option>
                    <option value="María López">María López</option>
                  </select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="notes">Notas</Label>
                  <textarea 
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Observaciones adicionales"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button variant="default">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-x-2">
          <Button variant="violet">
            <FileText className="mr-2 h-4 w-4" /> Generar Informe
          </Button>
          <Button variant="violet">
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="violet">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente, técnico o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle>Registro de Recaudaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-sm text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-center">Máquinas</th>
                  <th className="px-4 py-3 text-right">Importe</th>
                  <th className="px-4 py-3 text-left">Técnico</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollections.map((collection) => (
                  <tr key={collection.id} className="border-b border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 text-muted-foreground" />
                        {collection.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatDate(collection.date)}</td>
                    <td className="px-4 py-3 font-medium">{collection.client}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        {collection.machines}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(collection.amount)}</td>
                    <td className="px-4 py-3">{collection.technician}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="violet" size="sm">Editar</Button>
                        <Button variant="default" size="sm">Detalle</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionsPage;
