//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import axios from "axios";
import crypto from 'crypto';

const momoClient = async (req, res) => {
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const { orderId, amount } = req.body;
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  const redirectUrl = process.env.REDIRECT_URL;
  const ipnUrl = process.env.MOMO_IPN_URL + '/api/momo/callback';
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
  console.log("MOMO CALLBACK:: ");
  const data = req.body;
  const momoCallbackData = { ...data, success: true };
  console.log("momoCallbackData: ", momoCallbackData);
  return res.status(200).json(momoCallbackData);
}

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

export { momoClient, momoCallback, momoVerifyTransaction };