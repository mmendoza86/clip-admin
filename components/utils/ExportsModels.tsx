import { DepositoExport, PagoExport } from '../types/exportTypes';

type ExportTransformer = (data: any[]) => any[];

type DepositoApi = {
  transactionId: string;
  setflow: string;
  fechaTransaccion: string;
  fechaDeposito: string;
  recibo: string;
  reciboDeposito: string;
  referencia: string;
  monto: number;
  propina: number;
  msi: string | null;
  plazo: number;
  porcentaje_De_Comision: number;
  comision_En_Pesos: number;
  iva: number;
  retencion_Total: number;
  monto_Neto: number;
  nombre_De_La_Cuenta: string;
  usuarioDeposito: string;
  usuarioTransaccion: string;
};


const exportModels: Record<string, ExportTransformer> = {
  depositos: (data: any[]): DepositoExport[] => {
    const depositos = data as DepositoApi[];

    return depositos.map(d => ({
      TransaccionId: d.transactionId,
      Recibo: d.recibo,
      ReciboDeposito: d.reciboDeposito,
      FechaTransaccion: new Date(d.fechaTransaccion)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19),
      FechaDeposito: new Date(d.fechaDeposito)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19),
      Referencia: d.referencia,
      Monto: d.monto,
      Propina: d.propina,
      MSI: d.msi,
      Plazo: d.plazo,
      PorcentajeDeComision: d.porcentaje_De_Comision,
      ComisionEnPesos: d.comision_En_Pesos,
      IVA: d.iva,
      RetencionTotal: d.retencion_Total,
      MontoNeto: d.monto_Neto,
      NombreDeLaCuenta: d.nombre_De_La_Cuenta,
      UsuarioDeposito: d.usuarioDeposito,
      UsuarioTransaccion: d.usuarioTransaccion
    }));
  },

  transacciones: (data: any[]): PagoExport[] =>
    data.map((p: any) => ({
      ID: p.id,
      Recibo: p.receiptNo,
      Fecha: new Date(p.createdAt).toISOString().split('T').join(' ').slice(0, 19),
      Correo: p.userEmail,
      Estado: p.status,
      Método: p.paymentMethod,
      SubTipo: p.subType,
      Marca: p.card.brand,
      Banco: p.card.issuer,
      Últimos4: `**** ${p.card.last4}`,
      Moneda: p.currency,
      Monto: p.amount,
      Propina: p.tip,
      Total: p.total
    }))
};



export function getExportModel(seccion: string): ExportTransformer {
  return exportModels[seccion] || ((data) => data);
}
