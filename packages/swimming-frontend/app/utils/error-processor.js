export default function errorCatcher(error) {
  let errorObject = {};
  const messages = error.errors[0].details;
  for(let key in messages) {
    if( messages.hasOwnProperty( key ) ) {
      errorObject[key] = messages[key];
    }
  }
  return errorObject;
}
