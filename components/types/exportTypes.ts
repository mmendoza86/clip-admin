// types/exportTypes.ts

export interface DepositoExport {
  TransaccionId: string;
  Recibo: string;
  ReciboDeposito: string;
  FechaTransaccion: string;
  FechaDeposito: string;
  Referencia: string;
  Monto: number;
  Propina: number;
  MSI: string | null;
  Plazo: number;
  PorcentajeDeComision: number;
  ComisionEnPesos: number;
  IVA: number;
  RetencionTotal: number;
  MontoNeto: number;
  NombreDeLaCuenta: string;
  UsuarioDeposito: string;
  UsuarioTransaccion: string;
};


interface Payment {
  id: number;
  settlementId: number;
  receiptNo: string;
  paymentDate: string; // Se puede considerar como Date, pero mantengo el formato string por el formato ISO
  amount: number;
  tip: number;
  settledAmount: number;
  totalRetention: number;
  paymentMethod: string;
  cardBrand: string;
  cardLast4: string;
  cardIssuer: string;
  userEmail: string;
}




export interface PagoExport {
  ID: number;
  Recibo: string;
  Fecha: string;
  Correo: string;
  Estado: string;
  Método: string;
  SubTipo: string;
  Marca: string;
  Banco: string;
  Últimos4: string;
  Moneda: string;
  Monto: number;
  Propina: number;
  Total: number;
}

export interface ConciliacionDetalle {
  transactionId: string;
  setflow: string;
  fechaTransaccion: string; // ISO Date string
  fechaDeposito: string;    // ISO Date string
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
}

