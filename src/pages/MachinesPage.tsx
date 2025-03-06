import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Download, Upload, FileText, Search, CheckCircle2, Printer, QrCode, Share2 } from 'lucide-react';
import { getStatusConfig } from '@/lib/utils';
import { MachineQRCode } from '@/components/MachineQRCode';
import { RootState, AppDispatch } from '@/store';
import { fetchMachines, addMachine, updateMachine, deleteMachine, installMachine } from '@/store/slices/machinesSlice';
import { toast } from '@/components/ui/use-toast';

// Mock data for machines
const mockMachines = [
  { id: 'M001', type: 'pinball', model: 'Pinball 1', client: 'Sin asignar', status: 'activa' },
  { id: 'M002', type: 'darts', model: 'Darts 1', client: 'Sin asignar', status: 'activa' },
  { id: 'M003', type: 'arcade', model: 'Arcade 1', client: 'Sin asignar', status: 'activa' },
  { id: 'M004', type: 'foosball', model: 'Foosball 1', client: 'Sin asignar', status: 'activa' },
  { id: 'M005', type: 'pinball', model: 'Pinball 2', client: 'Sin asignar', status: 'activa' },
  { id: 'M006', type: 'darts', model: 'Darts 2', client: 'Sin asignar', status: 'activa' },
  { id: 'M007', type: 'arcade', model: 'Arcade 2', client: 'Sin asignar', status: 'activa' },
  { id: 'M008', type: 'foosball', model: 'Foosball 2', client: 'Sin asignar', status: 'activa' },
  { id: 'M009', type: 'pinball', model: 'Pinball 3', client: 'Sin asignar', status: 'activa' },
  { id: 'M010', type: 'darts', model: 'Darts 3', client: 'Sin asignar', status: 'activa' },
  { id: 'M011', type: 'arcade', model: 'Arcade 3', client: 'Sin asignar', status: 'activa' },
  { id: 'M012', type: 'foosball', model: 'Foosball 3', client: 'Sin asignar', status: 'activa' },
];

const MachinesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { machines, status } = useSelector((state: RootState) => state.machines);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: '',
    type: 'arcade',
    model: '',
    brand: '',
    cost: '',
    purchaseDate: '',
  });
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const { clients } = useSelector((state: RootState) => state.clients);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedResponsibility, setAcceptedResponsibility] = useState(false);
  const [installationDate, setInstallationDate] = useState('');
  const [installationCounter, setInstallationCounter] = useState('');
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [technician, setTechnician] = useState('');
  const [selectedQRMachine, setSelectedQRMachine] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const filteredMachines = machines.filter(machine => 
    machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addMachine({
        ...formData,
        cost: parseFloat(formData.cost),
        status: 'warehouse',
        initialCounter: 0,
        splitPercentage: 50
      })).unwrap();
      setIsDialogOpen(false);
      setFormData({
        serialNumber: '',
        type: 'arcade',
        model: '',
        brand: '',
        cost: '',
        purchaseDate: '',
      });
    } catch (error) {
      console.error('Error al crear la máquina:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta máquina?')) {
      try {
        await dispatch(deleteMachine(id)).unwrap();
      } catch (error) {
        console.error('Error al eliminar la máquina:', error);
      }
    }
  };

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine || !selectedClient) {
      toast({
        title: "Error",
        description: "Por favor selecciona una máquina y un cliente.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar las condiciones de instalación.",
        variant: "destructive",
      });
      return;
    }

    if (!location || !technician) {
      toast({
        title: "Error",
        description: "Todos los campos obligatorios deben ser completados.",
        variant: "destructive",
      });
      return;
    }

    const selectedMachineData = machines.find(m => m.id === selectedMachine);
    if (!selectedMachineData) {
      toast({
        title: "Error",
        description: "No se pudo encontrar la máquina seleccionada.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(installMachine({
        machineId: selectedMachine,
        clientId: selectedClient,
        installationData: {
          responsibleName,
          responsibleId,
          acceptedTerms,
          acceptedResponsibility: true,
          acceptanceDate: new Date().toISOString(),
          installationDate,
          installationCounter: selectedMachineData.currentCounter,
          location,
          observations,
          technician
        }
      })).unwrap();

      toast({
        title: "¡Máquina instalada!",
        description: "La máquina ha sido instalada exitosamente.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        duration: 3000,
      });

      setIsDialogOpen(false);
      setSelectedMachine(null);
      setSelectedClient(null);
      setAcceptedTerms(false);
      setAcceptedResponsibility(false);
      setResponsibleName('');
      setResponsibleId('');
      setInstallationDate(new Date().toISOString().split('T')[0]);
      setInstallationCounter('');
      setLocation('');
      setObservations('');
      setTechnician('');
      dispatch(fetchMachines());
    } catch (error) {
      console.error('Error al instalar la máquina:', error);
      toast({
        title: "Error",
        description: "No se pudo instalar la máquina. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Máquinas</h1>
          <p className="text-muted-foreground">Gestiona tu inventario de máquinas</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" /> Nueva Máquina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Instalación de Máquina</DialogTitle>
                <DialogDescription>
                  Por favor, completa los datos de instalación.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="serialNumber">Número de Serie</Label>
                  <Input 
                    id="serialNumber" 
                    placeholder="Número de serie único"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="type">Tipo</Label>
                  <select 
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="arcade">Arcade</option>
                    <option value="pinball">Pinball</option>
                    <option value="redemption">Redención</option>
                  </select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="model">Modelo</Label>
                  <Input 
                    id="model" 
                    placeholder="Modelo de la máquina"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="brand">Marca</Label>
                  <Input 
                    id="brand" 
                    placeholder="Marca del fabricante"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="cost">Costo</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                  <Input 
                    id="purchaseDate" 
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="client">Cliente</Label>
                  <select 
                    id="client"
                    value={selectedClient?.toString() || ''}
                    onChange={(e) => {
                      const clientId = e.target.value ? parseInt(e.target.value) : null;
                      setSelectedClient(clientId);
                      if (clientId) {
                        const selectedClientData = clients.find(c => c.id === clientId);
                        if (selectedClientData) {
                          setResponsibleName(selectedClientData.owner);
                          setResponsibleId(selectedClientData.taxId);
                        }
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="responsibleName">Responsable</Label>
                  <Input
                    id="responsibleName"
                    value={responsibleName}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="responsibleId">DNI/CIF del Responsable</Label>
                  <Input
                    id="responsibleId"
                    value={responsibleId}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="installationCounter">Contador Inicial</Label>
                  <Input
                    id="installationCounter"
                    type="number"
                    min="0"
                    value={selectedMachine ? machines.find(m => m.id === selectedMachine)?.currentCounter.toString() || '0' : '0'}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="signature">Firma del Cliente</Label>
                    <div className="h-40 border rounded-md bg-muted/50 flex items-center justify-center">
                      [Área para firma digital - En desarrollo]
                    </div>
                  </div>

                  <div className="hidden">
                    <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                      <h4 className="font-medium">Cláusulas del Contrato de Depósito</h4>
                      
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>1. El DEPOSITARIO (cliente) reconoce recibir en depósito la máquina especificada, propiedad de la empresa, en perfecto estado de funcionamiento.</p>
                        <p>2. El DEPOSITARIO se compromete a:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Mantener la máquina en un lugar seguro y apropiado</li>
                          <li>Notificar inmediatamente cualquier mal funcionamiento</li>
                          <li>No manipular ni permitir la manipulación de la máquina</li>
                          <li>Permitir el acceso al personal autorizado para mantenimiento</li>
                          <li>Proteger la máquina de daños físicos, robo o vandalismo</li>
                        </ul>
                        <p>3. El DEPOSITARIO será responsable económicamente en caso de:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Daños causados por negligencia o mal uso</li>
                          <li>Robo o hurto por falta de medidas de seguridad</li>
                          <li>Manipulación no autorizada</li>
                          <li>Daños causados por terceros bajo su responsabilidad</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      El cliente acepta las condiciones de instalación y depósito de la máquina
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setAcceptedTerms(false);
                      setAcceptedResponsibility(false);
                      setResponsibleName('');
                      setResponsibleId('');
                      setInstallationDate(new Date().toISOString().split('T')[0]);
                      setInstallationCounter('');
                      setLocation('');
                      setObservations('');
                      setTechnician('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="default"
                    disabled={!acceptedTerms || !location || !technician}
                  >
                    Instalar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-x-2">
          <Button variant="violet">
            <FileText className="mr-2 h-4 w-4" /> Plantilla
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
          placeholder="Buscar por número de serie, modelo o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Dialog open={selectedQRMachine !== null} onOpenChange={(open) => !open && setSelectedQRMachine(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR de la Máquina</DialogTitle>
            <DialogDescription>
              Escanea o imprime el código QR para acceder a la información de la máquina
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-72 h-72 bg-violet-500 rounded-xl p-2 shadow-lg flex items-center justify-center">
              <div className="w-[80%] h-[80%] bg-white rounded-lg flex items-center justify-center">
                <div className="w-full h-full">
                  <MachineQRCode machine={selectedQRMachine} />
                </div>
              </div>
            </div>
            <div className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Código:</p>
                  <p className="text-muted-foreground">{selectedQRMachine?.serialNumber}</p>
                </div>
                <div>
                  <p className="font-medium">Tipo:</p>
                  <p className="text-muted-foreground">{selectedQRMachine?.type}</p>
                </div>
                <div>
                  <p className="font-medium">Modelo:</p>
                  <p className="text-muted-foreground">{selectedQRMachine?.model}</p>
                </div>
                <div>
                  <p className="font-medium">Estado:</p>
                  <p className="text-muted-foreground">{selectedQRMachine && getStatusConfig(selectedQRMachine.status).label}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir QR
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "Compartir",
                    description: "Función de compartir en desarrollo",
                  });
                }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir QR
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle>Listado de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-sm text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left w-8">QR</th>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Modelo</th>
                  <th className="px-4 py-3 text-left">Cliente Asignado</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.map((machine) => (
                  <tr key={machine.id} className="border-b border-border">
                    <td className="px-4 py-3">
                      <Button 
                        size="icon"
                        className="bg-lime-500 hover:bg-lime-600 text-blue-900"
                        onClick={() => setSelectedQRMachine(machine)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3">{machine.serialNumber}</td>
                    <td className="px-4 py-3">{machine.type}</td>
                    <td className="px-4 py-3">{machine.model}</td>
                    <td className="px-4 py-3">{machine.clientId || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusConfig(machine.status).className}>
                        {getStatusConfig(machine.status).label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        {machine.status === 'warehouse' ? (
                          <Button 
                            className="bg-lime-500 hover:bg-lime-600 text-violet-700"
                            size="sm"
                            onClick={() => {
                              setSelectedMachine(machine.id);
                              setIsDialogOpen(true);
                            }}
                          >
                            Instalación
                          </Button>
                        ) : (
                          <Button 
                            className="bg-lime-500 hover:bg-lime-600 text-violet-700"
                            size="sm"
                            onClick={() => {
                              setSelectedMachine(machine.id);
                              setIsDialogOpen(true);
                            }}
                          >
                            Traslado
                          </Button>
                        )}
                        <Button variant="violet" size="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </Button>
                        <Button 
                          variant="violet" 
                          size="icon"
                          onClick={() => handleDelete(machine.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </Button>
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

export default MachinesPage;
