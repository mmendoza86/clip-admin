// pages/api/transacciones/index.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = [
    {
      id: "3d62e0-57a8-d22-a90-d59e0d94f",
      amount: 0.01,
      tip_amount: 0,
      amount_refunded: 0,
      installment_amount: 0.01,
      installments: 1,
      capture_method: "automatic",
      net_amount: 0.01,
      paid_amount: 0.01,
      captured_amount: 0.01,
      binary_mode: false,
      approved_at: "2024-02-27T04:14:50.868Z",
      country: "MX",
      currency: "MXN",
      description: "Test Transparent Checkout API",
      external_reference: "",
      customer: {
        address: {
          city: "Benito Juárez",
          country: "México",
          colony: "San Pedro de los pinos",
          number: "118",
          postal_code: "03800",
          state: "ciudad de México",
          street: "Av Uno"
        },
        description: "Descripción",
        email: "correo@ejemplo.com",
        first_name: "John",
        last_name: "Doe",
        identification: {
          id: "INE",
          type: "123456"
        },
        phone: "5555555555"
      },
      payment_method: {
        id: "master",
        type: "credit_card",
        card: {
          bin: "555555",
          issuer: "SANTANDER PR",
          name: "John Doe Doe",
          country: "MX",
          last_digits: "2222",
          exp_year: "99",
          exp_month: "12"
        },
        token: "0915e7-f6f-862-89e-0c5d71ae6"
      },
      pending_action: {},
      receipt_no: "SzWn",
      refunds: [],
      statement_descriptor: "",
      status: "approved",
      status_detail: {
        code: "AP-PAI01",
        message: "paid"
      },
      metadata: {},
      return_url: "",
      webhook_url: "",
      created_at: "2024-02-27T04:14:49.687Z",
      version: 1
    }
  ];

  res.status(200).json({
    pages: {
      size: 50,
      number: 1,
      total: 1,
      total_results: results.length
    },
    results
  });
}
