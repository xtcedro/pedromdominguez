// /types/payment.d.ts

export interface PaymentIntentInput {
  amount: number;
}

export interface TerminalPaymentIntentInput {
  amount: number;
}

export interface CaptureOrCancelInput {
  paymentIntentId: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  created: number;
  status: string;
  payment_method_types: string[];
}

export interface ConnectionToken {
  secret: string;
}