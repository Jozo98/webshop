import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { firstValueFrom } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise = loadStripe(environment.stripePublicKey)

  constructor(private http: HttpClient) {}

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise
  }

  async createPaymentIntent(amount: number, currency: string): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/create-payment-intent`, {
        amount,
        currency
      })
    )
    return response.clientSecret
  }
}