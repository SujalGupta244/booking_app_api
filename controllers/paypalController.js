const axios = require("axios")

const createOrder = async (req,res)=> {
    try{

      const accessToken = req.body.access_token;

      let data = JSON.stringify({
        "intent": "CAPTURE",
        "purchase_units": [
          {
          "description":"place seleceted is",
          "amount": {
              "currency_code": "USD",
              "value": `${req.body.product.cost}`,
          }
        }
      ],
      "payment_source": {
        "paypal": {
          "experience_context": {
              "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
              "brand_name": "Airbnc",
              "shipping_preference":"NO_SHIPPING",
              "locale": "en-US",
              "billing_agreement_id":"",
              "landing_page": "LOGIN",
              "user_action": "PAY_NOW",
              "email_address":"",
              "return_url": "http://localhost:5173/returnUrl",
              "cancel_url": "http://localhost:5173/cancelUrl"
          }
        }
      }
      });

      let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      headers: { 
          'Content-Type': 'application/json', 
          "Prefer":"return=minimal",
          'Authorization': `Bearer ${accessToken}`
      },
      data : data
      };

      const response = await axios.request(config)
      let resData = await response.data;

      return res.send(resData);
    }catch(err){
      return res.send(err);
    }   

};

const captureOrder = async (req, res)=>{
  try{
    const {orderID} = req.body;
    if(!orderID){
        throw new Error("OrderId not provided")
    }
    console.log("Body : ",req.body)
    const accessToken = req.body.access_token;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${accessToken}`
      }
    };
    
    const response = await axios.request(config)
    
    const data = await response.data
    // console.log(data)
    return res.send(data);
    
  }catch(err){
    // console.log(err.message)
    return res.send(err);
  }
};
  

module.exports = {createOrder, captureOrder}


// {
//   orderID: '0E8601722Y725070J',
//   payerID: 'W6E5T8AZ94DAA',
//   paymentID: '0E8601722Y725070J',
//   billingToken: null,
//   facilitatorAccessToken: 'A21AALO9LzNv7wyrrYc58qpQgiayyY5W194Fxw7mBHGOD84ANCb6d_HZsxqOizD2VGEWRgjRJAHrIYEJBJ-oWe1kBKlosvdWQ',
//   paymentSource: 'paypal'
// }