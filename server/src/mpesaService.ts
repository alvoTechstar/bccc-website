import axios from 'axios';
import 'dotenv/config';

// Use sandbox URLs
const MPESA_API_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const BUSINESS_SHORTCODE = process.env.MPESA_PAYBILL_NUMBER || '174379';
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa-callback';

export interface StkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: string;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

class MpesaService {
  private accessToken: string | null = null;
  private tokenExpiryTime: number = 0;

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && this.tokenExpiryTime > now + (30 * 60 * 1000)) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
      console.log('Attempting to get M-Pesa access token...');
      const response = await axios.get(AUTH_URL, {
        headers: {
          'Authorization': `Basic ${auth}`
        },
        timeout: 30000
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiryTime = now + (response.data.expires_in * 1000);
      console.log('Successfully obtained M-Pesa access token.');
      return this.accessToken!;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error during token fetch:', error.message);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      } else {
        console.error('Unexpected error fetching M-Pesa access token:', error);
      }
      throw new Error('Failed to get M-Pesa access token.');
    }
  }

  public async sendStkPush(phone: string, amount: number, accountReference: string): Promise<any> {
    try {
      console.log('sendStkPush parameters:', { phone, amount, accountReference });

      // The validation check is now correct with the updated function signature
      if (!phone || !amount || !accountReference) {
        throw new Error('Missing required parameters for STK push');
      }

      const token = await this.getAccessToken();

      // Generate timestamp and password
      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);
      const password = Buffer.from(`${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

      const stkRequest: StkPushRequest = {
        BusinessShortCode: BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount.toString(),
        PartyA: phone,
        PartyB: BUSINESS_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: 'Church Offering'
      };

      console.log(`Sending STK Push request to: ${MPESA_API_URL}`);
      console.log('STK Push Request Details:', {
        phoneNumber: stkRequest.PhoneNumber,
        amount: stkRequest.Amount,
        accountReference: stkRequest.AccountReference,
        businessShortCode: stkRequest.BusinessShortCode,
        callbackURL: stkRequest.CallBackURL
      });

      const response = await axios.post(MPESA_API_URL, stkRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('STK Push Success:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error sending STK Push request:', error.message);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        return {
          ResponseCode: error.response?.status?.toString() || "500",
          ResponseDescription: error.response?.statusText || "Failed to communicate with M-Pesa API.",
          errorMessage: error.message,
          requestId: error.response?.data?.requestId
        };
      } else {
        console.error('Unexpected error sending STK Push request:', error);
        return {
          ResponseCode: "500",
          ResponseDescription: "An unexpected error occurred.",
          errorMessage: (error as Error).message
        };
      }
    }
  }
}

export const mpesaService = new MpesaService();