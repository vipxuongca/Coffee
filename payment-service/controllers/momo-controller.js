//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import axios from "axios";
import crypto from 'crypto';
import Payment from '../models/payment-model.js';
import { orderApi } from '../api/order-api.js';

const verifyMomoSignature = (data) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = data;

  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  return expectedSignature === signature;
};

const momoClient = async (req, res) => {
  console.log('MOMO CLIENT REACHED...');
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const { orderId, amount } = req.body;
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  const redirectUrl = process.env.REDIRECT_URL;
  const ipnUrl = process.env.MOMO_IPN_URL;
  var requestType = "payWithMethod";
  var requestId = orderId;
  var extraData = '';
  // var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  //json object send to MoMo endpoint
  console.log("ipnUrl:", ipnUrl);
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  });
  //Create the HTTPS objects
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }

  let result;
  try {
    result = await axios(options);
    const momoResponse = result.data;
    const data = { ...momoResponse, success: true };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "server error"
    });
  }
}

const momoCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log('MOMO CALLBACK REACHED -- ', data);

    // 1. Verify signature (SECURITY GATE)
    if (!verifyMomoSignature(data)) {
      // Do not reveal anything, do not retry
      return res.status(200).end();
    }

    const { orderId, resultCode, transId, amount } = data;

    // 2. Idempotent write (atomic)
    await Payment.updateOne(
      {
        provider: "MOMO",
        providerPaymentId: String(transId)
      },
      {
        orderId,
        provider: "MOMO",
        providerPaymentId: String(transId),
        amount,
        status: resultCode === 0 ? "SUCCESS" : "FAILED",
        rawResponse: data
      },
      { upsert: true }
    );

    // 3. if success, notify order service to delete cart and reduce stock
    if (resultCode === 0) {

      const notifyData = {
        orderId,
        provider: "MOMO",
        providerPaymentId: String(transId),
        amount
      };
      console.log('NOTIFYING ORDER SERVICE OF MOMO PAYMENT SUCCESS -- ', notifyData);

      await momoSuccessNotifyOrder(notifyData);
    }

    // 4. Terminate this gateway immediately
    return res.status(200).end();

  } catch (err) {
    console.error('MOMO CALLBACK ERROR', err);

    // NEVER cause retries from MoMo
    return res.status(200).end();
  }
};

const momoVerifiedCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log('MOMO VERIFIED CALLBACK REACHED -- ', data);

    const { orderId, resultCode, transId, amount } = data;
    console.log("parsed data -- ", orderId, resultCode, transId, amount);

    // 2. Idempotent write (atomic)
    await Payment.updateOne(
      {
        provider: "MOMO",
        providerPaymentId: String(transId),
      },
      {
        $set: {
          amount,
          status: resultCode === 0 ? "SUCCESS" : "FAILED",
          rawResponse: data,
        },
        $setOnInsert: {
          orderId,
          provider: "MOMO",
          providerPaymentId: String(transId),
        },
      },
      { upsert: true }
    );


    // 3. if success, notify order service to delete cart and reduce stock
    if (resultCode === 0) {
      console.log("result 0 is reached");
      const notifyData = {
        orderId,
        provider: "MOMO",
        providerPaymentId: String(transId),
        amount
      };
      console.log('NOTIFYING ORDER SERVICE OF MOMO PAYMENT SUCCESS -- ', notifyData);

      await momoSuccessNotifyOrder(notifyData);
    }

    // 4. Terminate this gateway immediately
    return res.status(200).end();

  } catch (err) {
    console.error('MOMO CALLBACK ERROR', err);

    // NEVER cause retries from MoMo
    return res.status(200).end();
  }
};

const momoVerifyTransaction = async (req, res) => {
  /*
  Expected payload:
  {
    "orderId": "123456789"
  }
  */

  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const { orderId } = req.body;

  const rawSignature = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=MOMO&requestId=" + orderId;

  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi"
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }

  let result;
  try {
    result = await axios(options);
    const momoResponse = result.data;
    const data = { ...momoResponse, success: true };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "server error"
    });
  }
}

const momoSuccessNotifyOrder = async () => {
  console.log('MOMO SUCCESS NOTIFY ORDER REACHED...');
  const payments = await Payment.find({
    notified: false,
    status: { $in: ['SUCCESS', 'FAILED'] }
  }).limit(50);

  for (const p of payments) {
    try {
      console.log('Notifying order service for payment -- ', p._id);
      const notifyingData = {
        orderId: String(p.orderId),
        provider: p.provider,
        providerPaymentId: p.providerPaymentId,
        amount: p.amount,
        status: p.status
      }

      console.log('Notifying data -- ', notifyingData);
      await orderApi.momoResult(notifyingData);

      p.notified = true;
      p.notifiedAt = new Date();
      await p.save();
    } catch (err) {
      // Do nothing — retry next run
    }
  }
};

const momoVerifiedCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log('MOMO VERIFIED CALLBACK REACHED -- ', data);

    const { orderId, resultCode, transId, amount } = data;
    console.log("parsed data -- ", orderId, resultCode, transId, amount);

    // 2. Idempotent write (atomic)
    await Payment.updateOne(
      {
        provider: "MOMO",
        providerPaymentId: String(transId),
      },
      {
        $set: {
          amount,
          status: resultCode === 0 ? "SUCCESS" : "FAILED",
          rawResponse: data,
        },
        $setOnInsert: {
          orderId,
          provider: "MOMO",
          providerPaymentId: String(transId),
        },
      },
      { upsert: true }
    );


    // 3. if success, notify order service to delete cart and reduce stock
    if (resultCode === 0) {
      console.log("result 0 is reached");
      const notifyData = {
        orderId,
        provider: "MOMO",
        providerPaymentId: String(transId),
        amount
      };
      console.log('NOTIFYING ORDER SERVICE OF MOMO PAYMENT SUCCESS -- ', notifyData);

      await momoSuccessNotifyOrder(notifyData);
    }

    // 4. Terminate this gateway immediately
    return res.status(200).end();

  } catch (err) {
    console.error('MOMO CALLBACK ERROR', err);

    // NEVER cause retries from MoMo
    return res.status(200).end();
  }
};

export { momoClient, momoCallback, momoVerifyTransaction, momoSuccessNotifyOrder, momoVerifiedCallback, momoVerifiedCallback };