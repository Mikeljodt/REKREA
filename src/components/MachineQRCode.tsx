import { QRCodeSVG } from 'qrcode.react';
import { Machine } from '@/lib/db';

interface MachineQRCodeProps {
  machine: Machine;
}

export const MachineQRCode = ({ machine }: MachineQRCodeProps) => {
  // Crear un objeto con la información de la máquina
  const machineData = {
    id: machine.id,
    serialNumber: machine.serialNumber,
    type: machine.type,
    model: machine.model,
    brand: machine.brand,
    status: machine.status,
    clientId: machine.clientId,
    currentCounter: machine.currentCounter,
  };

  // Convertir a JSON y codificar en base64 para el QR
  const qrData = btoa(JSON.stringify(machineData));

  return (
    <div className="bg-white p-1 rounded-lg">
      <QRCodeSVG
        value={qrData}
        size={64}
        level="H"
        includeMargin={true}
        fgColor="#32CD32" // Color lima
        bgColor="#FFFFFF"
      />
    </div>
  );
};
