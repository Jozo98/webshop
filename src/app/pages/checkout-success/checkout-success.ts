import { Component, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { loadStripe } from '@stripe/stripe-js'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'checkout-success',
  standalone: true,
  imports: [],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css'
})
export class CheckoutSuccess implements OnInit {
  status = signal<'loading' | 'succeeded' | 'failed'>('loading')

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const clientSecret = this.route.snapshot.queryParamMap.get('payment_intent_client_secret')
    if (!clientSecret) {
      this.status.set('failed')
      return
    }

    const stripe = await loadStripe(environment.stripePublicKey)
    if (!stripe) {
      this.status.set('failed')
      return
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

    if (paymentIntent?.status === 'succeeded') {
      this.status.set('succeeded')
    } else {
      this.status.set('failed')
    }
  }
}