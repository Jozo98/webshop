import { Component, AfterViewInit, ViewChild, ElementRef, signal, Input } from '@angular/core'
import { StripeService } from '../../services/stripe.service'
import { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements AfterViewInit {
  @ViewChild('paymentElement') paymentElementRef!: ElementRef
  private stripe!: Stripe
  elements!: StripeElements
  paymentElement!: StripePaymentElement

  public amount = 0;
  private initialized = false;
  private viewReady = false;

  isLoading = signal(true)
  errorMessage = signal<string | null>(null)

  constructor(private stripeService: StripeService) {}

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryInit();
  }

  private async tryInit() {
    if (this.initialized) return;
    if (!this.viewReady) return;
    if (!this.amount || this.amount <= 0) {
      this.errorMessage.set('Your cart is empty.')
      this.isLoading.set(false)
      return;
    }

    this.initialized = true;
    const amountInCents = Math.round(this.amount * 100)

    const stripe = await this.stripeService.getStripe()
    if (!stripe) return
    this.stripe = stripe

    const clientSecret = await this.stripeService.createPaymentIntent(amountInCents, 'chf')

    this.elements = stripe.elements({ clientSecret })
    this.paymentElement = this.elements.create('payment', {
      wallets: { link: 'never' }
    })
    this.paymentElement.mount(this.paymentElementRef.nativeElement)

    this.isLoading.set(false)
  }

  async handlePayment() {
    if (!this.stripe || !this.elements) return
    this.errorMessage.set(null)

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: 'http://localhost:4200/checkout/success',
      },
    })

    if (error) {
      this.errorMessage.set(error.message ?? 'Payment failed. Please try again.')
    }
    
  }
}