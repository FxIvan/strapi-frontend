import React from 'react'
import { loadStripe } from '@stripe/stripe-js' //conexion con la plataforma
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'; 
import axios from 'axios'

const stripePromise = loadStripe('pk_test_51KaLSeBDTCuuGArIhkskcqG9J0VNElLpQh5qkqCR3UnQak6T8u6qgGGxlpXXYpp91phf1TfV5xSocebr7fGxGFhF00vYyWA20a') //key publica

const CheckoutForm = () =>{

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async(e) =>{
    e.preventDefault()

    const {error, paymentMethod} = await stripe.createPaymentMethod({ /* llamamos a stripe para que genere un nuevo metodo de pago al hacer comprar */
      type:'card',//metodo de tarjeta
      card: elements.getElement(CardElement) // este es como un getElementById
      //este me devuelve dos cosas un error yel metodo de pago
    })

    /* SI NO EXISTE UN ERROR OCURRE ESTO */
    if(!error){
      const { id } = paymentMethod

      /*ENVIAMOS INFORMACION DE NUESTRO PRODUCTO AL CUAL COMPRAREMOS con su ID y PRECIO */
     const {data} = await axios.post('http://localhost:3001/api/pago' , {
        id,
        amount: 1000/*los amount se envia en centavo osea 10$ es igual 100*10centavos osea ponemos 1000centavos */
      })

      console.log(data)
    }

  }

  return(
    <form onSubmit={handleSubmit}>
      <img src='https://www.pngmart.com/files/4/Asus-Laptop-PNG-File.png' className='img-fluid'/>{/* img-fluid es para que no sobrepase el ancho */}
      <h3 className='text-center'>Precio: 10$</h3>
      <div className='form-group'>
        <CardElement className='form-control'/>{/* traemos de stripe que es el que valida la tarjeta */}
      </div>
      <div className='mt-3 text-center m-auto'>
        <button className='btn btn-success'>Comprar</button>
      </div>
    </form>
  )
}

 function App() {

  return (
    <Elements stripe={stripePromise}>{/* dentro de este voy a utilizar el formulario de medio de pago */}
      <div className='container'>
        <div className='row'>
          <div className='col-sm-4  offset-md-4'>
            <CheckoutForm className='form-control'/>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
