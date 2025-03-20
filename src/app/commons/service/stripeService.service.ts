import { Injectable } from '@angular/core';
import { Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeSericeService {
  stripe: Stripe;

  constructor() {
    this.loadStripe();
  }

  async loadStripe() {
    const stripe = await import('@stripe/stripe-js');
    this.stripe = await stripe.loadStripe(environment.stripePublicKey);
  }

  async redirectToCheckout(sessionId: string) {
    if (this.stripe) {
      const { error } = await this.stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } else {
      console.error('Stripe has not been initialized yet.');
    }
  }
  }


  
