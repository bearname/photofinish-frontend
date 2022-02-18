<template>
  <div>
    <section class="showcase">
      <div class="nes-container with-title">
        <h3>Donkey Kong Country SNES $19.99</h3>
        <div class="img">
          <img
              src="https://stripe-camo.global.ssl.fastly.net/6d097cce2c90965a3c955721cead3e8e0a9f8050f4122b2b3c50762fbffb326a/68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423864584e6c636c38775155526f654464315454683556566c4a53327846544642554e48786d624639305a584e3058316c7963464a58546e52726556424863336b35626c5648596b5a554e45706a656730305a7a5a565335315a"
              alt=""
              srcset=""
          />
        </div>
      </div>
    </section>
    <div class="nes-container with-title is-centered">
      <form @submit.prevent="handleSubmit">
        <fieldset :class="{ dis: loading }" class="fields">
          <div class="nes-field"></div>
          <div class="nes-field">
            <label for="name_field">Name</label>
            <input
                placeholder="Jane Doe"
                type="text"
                name="name"
                id="name_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="email_field">Email</label>
            <input
                placeholder="jane.doe@example.com "
                type="email"
                name="email"
                id="email_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="address_field">Address</label>
            <input
                placeholder="1234 Sycamore Street"
                type="text"
                name="address"
                id="address_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="city_field">City</label>
            <input
                placeholder="Reno"
                type="text"
                name="city"
                id="city_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="state_field">State</label>
            <input
                placeholder="Nevada"
                type="text"
                name="state"
                id="state_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="zip_field">Zip</label>
            <input
                placeholder="89523"
                type="text"
                name="zip"
                id="zip_field"
                class="nes-input"
            />
          </div>
          <div class="nes-field">
            <label for="email_field">Credit Card</label>
            <div id="stripe-element-mount-point" class="nes-input"/>
          </div>
        </fieldset>
        <div class="nes-field">
          <button
              type="submit"
              class="nes-btn is-primary"
              :class="{ dis: loading }"
          >
            {{ loading ? "Loading..." : "Pay $19.99" }}
          </button>
        </div>
      </form>
    </div>
    <h2>Or...</h2>
    <div class="nes-field mt">
      <button type="button" class="nes-btn is-success" @click="redirect">
        Pay $19.99 Page
      </button>
    </div>
  </div>
</template>

<script>
import {loadStripe} from "@stripe/stripe-js";
import {STRIPE_KEY} from "@/config";

const style = {
  style: {
    base: {
      iconColor: "#000",
      color: "#000",
      fontWeight: "800",
      fontFamily: "Press Start 2P",
      fontSize: "22px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883"
      },
      "::placeholder": {
        color: "green"
      }
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "red"
    }
  }
};
export default {
  name: "CheckOut",
  data() {
    return {
      stripe: null,
      loading: false,
      elements: null
    }
  },
  mounted() {
    this.stripeInit().then()
  },
  methods: {
    async stripeInit() {
      const ELEMENT_TYPE = "card";

      this.stripe = await loadStripe(STRIPE_KEY);

      this.elements = this.stripe.elements();
      const element = this.elements.create(ELEMENT_TYPE, style);
      element.mount("#paySystem-element-mount-point");
      this.loading = false;
    },
    async handleSubmit(event) {
      if (this.loading) return;
      this.loading = true;
      const {name, email, address, city, state, zip} = Object.fromEntries(
          new FormData(event.target)
      );
      console.log("here", name, email, address, city, state, zip);

      const billingDetails = {
        name,
        email,
        address: {
          city,
          line1: address,
          state,
          postal_code: zip
        }
      };

      const cardElement = this.elements.getElement("card");

      try {
        const token = await this.stripe.createToken(cardElement);
        console.log("token");
        console.log(token);
        const response = await fetch("http://localhost:8000/api/v1/charges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            receiptEmail: "ya.mikushoff@gmail.com",
            data: [
              {pictureId: "1"},
              {pictureId: "2"},
              {pictureId: "3"}
            ],
            stripeToken: token
          })
        });
        const {secret} = await response.json();
        console.log("secret", secret);


        // const paymentMethodReq = await this.paySystem.createPaymentMethod({
        //   type: "card",
        //   card: cardElement,
        //   billing_details: billingDetails
        // });
        //
        // console.log("domainerror?", paymentMethodReq);
        //
        // const {domainerror} = await this.paySystem.confirmCardPayment(secret, {
        //   payment_method: paymentMethodReq.paymentMethod.id
        // });
        // this.loading = false;
        // console.log("domainerror?", domainerror);
        this.$router.push("/success");
      } catch (error) {
        console.log("error", error);
        this.loading = false;
      }
    },
    redirect() {
      this.stripe.redirectToCheckout({
        successUrl: "http://localhost:3000/success",
        cancelUrl: "http://localhost:3000",
        lineItems: [
          {
            pictureId: "asf",
            price: "200",
            quantity: 1
          }
        ],
        mode: "payment"
      });
    }
  }
}
</script>

<style scoped>

</style>