import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { CardModule, SpinnerModule, ButtonDirective } from '@coreui/angular'
import { StripeService } from '../../services/stripe.service'
import { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [CardModule, SpinnerModule, ButtonDirective],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  @ViewChild('paymentElement') paymentElementRef!: ElementRef
  private stripe!: Stripe
  elements!: StripeElements
  paymentElement!: StripePaymentElement
  isLoading = true

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    const stripe = await this.stripeService.getStripe()
    if (!stripe) return
    this.stripe = stripe

    // Fetch clientSecret from your backend
    const clientSecret = await this.stripeService.createPaymentIntent(2999, 'usd')

    this.elements = stripe.elements({ clientSecret })
    this.paymentElement = this.elements.create('payment')
    this.paymentElement.mount(this.paymentElementRef.nativeElement)

    this.paymentElement.on('ready', () => {
      this.isLoading = false
    })
  }
}
